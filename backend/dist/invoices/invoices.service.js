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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./entities/invoice.entity");
const customers_service_1 = require("../customers/customers.service");
const events_gateway_1 = require("../events/events.gateway");
const ncf_series_entity_1 = require("./entities/ncf-series.entity");
let InvoicesService = class InvoicesService {
    invRepo;
    ncfRepo;
    customersService;
    dataSource;
    events;
    constructor(invRepo, ncfRepo, customersService, dataSource, events) {
        this.invRepo = invRepo;
        this.ncfRepo = ncfRepo;
        this.customersService = customersService;
        this.dataSource = dataSource;
        this.events = events;
    }
    async onModuleInit() {
        const exists = await this.ncfRepo.findOne({ where: { typeCode: 'B01', active: true } });
        if (!exists) {
            await this.ncfRepo.save(this.ncfRepo.create({ typeCode: 'B01', prefix: 'B010000', current: 1, end: 999999, active: true }));
        }
    }
    computeTotals(lines) {
        let subtotal = 0;
        let itbis = 0;
        for (const l of lines) {
            const lineSubtotal = l.qty * l.unitPrice;
            subtotal += lineSubtotal;
            const rate = l.itbisRate ?? 0.18;
            itbis += lineSubtotal * rate;
        }
        const total = subtotal + itbis;
        return {
            subtotal: subtotal.toFixed(2),
            itbisTotal: itbis.toFixed(2),
            total: total.toFixed(2),
        };
    }
    async reserveNcf(typeCode) {
        return await this.dataSource.transaction(async (manager) => {
            const repo = manager.getRepository(ncf_series_entity_1.NcfSeries);
            const series = await repo.findOne({ where: { typeCode, active: true } });
            if (!series)
                throw new common_1.BadRequestException('Serie NCF no disponible');
            if (series.current > series.end)
                throw new common_1.BadRequestException('Serie NCF agotada');
            const number = series.current;
            series.current = series.current + 1;
            await repo.save(series);
            const ncf = `${series.prefix}${String(number).padStart(6, '0')}`;
            return ncf;
        });
    }
    async create(input) {
        const customer = await this.customersService.findOne(input.customerId);
        const totals = this.computeTotals(input.lines);
        const issueDate = input.issueDate ?? new Date().toISOString().slice(0, 10);
        const due = new Date(issueDate);
        due.setDate(due.getDate() + (input.termsDays ?? customer.termsDays ?? 30));
        const inv = {
            customer,
            issueDate,
            dueDate: due.toISOString().slice(0, 10),
            subtotal: totals.subtotal,
            itbisTotal: totals.itbisTotal,
            total: totals.total,
            balance: totals.total,
            status: 'EMITIDA',
            ncfType: input.requiresFiscalReceipt ? input.ncfType ?? 'B01' : undefined,
            interestRateAnnual: String(input.interestRateAnnual ?? 0),
        };
        if (inv.ncfType) {
            inv.ncfNumber = await this.reserveNcf(inv.ncfType);
        }
        const saved = await this.invRepo.save(this.invRepo.create(inv));
        this.events.server?.emit('InvoiceCreated', { invoiceId: saved.id, customerId: customer.id });
        return saved;
    }
    async findAll(params) {
        return this.invRepo.find({ where: { ...(params?.status ? { status: params.status } : {}), ...(params?.customerId ? { customer: { id: params.customerId } } : {}) }, order: { issueDate: 'DESC' } });
    }
    async findOne(id) {
        const inv = await this.invRepo.findOne({ where: { id } });
        if (!inv)
            throw new common_1.NotFoundException('Factura no encontrada');
        return inv;
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(ncf_series_entity_1.NcfSeries)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        customers_service_1.CustomersService,
        typeorm_2.DataSource,
        events_gateway_1.EventsGateway])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map