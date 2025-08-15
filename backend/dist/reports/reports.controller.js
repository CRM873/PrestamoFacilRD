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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../invoices/entities/invoice.entity");
let ReportsController = class ReportsController {
    invRepo;
    constructor(invRepo) {
        this.invRepo = invRepo;
    }
    async summary() {
        const all = await this.invRepo.find();
        const totalReceivables = all.reduce((s, i) => s + parseFloat(i.balance), 0);
        const overdue = all
            .filter((i) => new Date(i.dueDate) < new Date() && parseFloat(i.balance) > 0)
            .reduce((s, i) => s + parseFloat(i.balance), 0);
        return {
            moneda: 'DOP',
            totalPorCobrar: totalReceivables.toFixed(2),
            montoVencido: overdue.toFixed(2),
        };
    }
    async aging(bucket) {
        const now = new Date();
        const all = await this.invRepo.find();
        const withDays = all.map((i) => ({ i, days: Math.max(0, Math.floor((Date.now() - new Date(i.dueDate).getTime()) / 86400000)) }));
        const ranges = {
            '0-30': [0, 30],
            '31-60': [31, 60],
            '61-90': [61, 90],
            '>90': [91, null],
        };
        const [start, end] = ranges[bucket] ?? [0, null];
        const filtered = withDays.filter(({ i, days }) => parseFloat(i.balance) > 0 && days >= start && (end === null || days <= end));
        const total = filtered.reduce((s, x) => s + parseFloat(x.i.balance), 0);
        return { bucket, total: total.toFixed(2), count: filtered.length };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboards/summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('aging'),
    __param(0, (0, common_1.Query)('bucket')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "aging", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map