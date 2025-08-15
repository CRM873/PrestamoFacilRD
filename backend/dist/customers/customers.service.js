"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
let CustomersService = class CustomersService {
    customersRepo;
    constructor(customersRepo) {
        this.customersRepo = customersRepo;
    }
    async create(data) {
        const entity = this.customersRepo.create({
            ...data,
            riskLevel: data.riskLevel ?? 'medio',
            termsDays: data.termsDays ?? 30,
            creditLimit: data.creditLimit ?? '0',
        });
        return this.customersRepo.save(entity);
    }
    async findAll(query) {
        const where = [];
        if (query?.q) {
            where.push({ name: (0, typeorm_2.ILike)(`%${query.q}%`) });
            where.push({ rncCedula: (0, typeorm_2.ILike)(`%${query.q}%`) });
        }
        if (query?.risk) {
            where.push({ riskLevel: query.risk });
        }
        return this.customersRepo.find({
            where: where.length ? where : undefined,
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const c = await this.customersRepo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Cliente no encontrado');
        return c;
    }
    async update(id, data) {
        await this.customersRepo.update({ id }, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.customersRepo.delete({ id });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map