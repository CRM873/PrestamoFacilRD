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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const customers_service_1 = require("../customers/customers.service");
const invoices_service_1 = require("../invoices/invoices.service");
const invoice_entity_1 = require("../invoices/entities/invoice.entity");
const events_gateway_1 = require("../events/events.gateway");
let PaymentsService = class PaymentsService {
    payRepo;
    allocRepo;
    invRepo;
    customersService;
    invoicesService;
    events;
    constructor(payRepo, allocRepo, invRepo, customersService, invoicesService, events) {
        this.payRepo = payRepo;
        this.allocRepo = allocRepo;
        this.invRepo = invRepo;
        this.customersService = customersService;
        this.invoicesService = invoicesService;
        this.events = events;
    }
    async allocateOldestFirst(customerId, amount) {
        const invoices = await this.invRepo.find({ where: { customer: { id: customerId }, status: 'EMITIDA' }, order: { dueDate: 'ASC' } });
        const allocations = [];
        let remaining = amount;
        for (const inv of invoices) {
            if (remaining <= 0)
                break;
            const bal = parseFloat(inv.balance);
            const apply = Math.min(remaining, bal);
            if (apply > 0) {
                allocations.push({ invoiceId: inv.id, amount: apply });
                remaining -= apply;
            }
        }
        return allocations;
    }
    async record(input) {
        const customer = await this.customersService.findOne(input.customerId);
        const payment = this.payRepo.create({
            customer,
            method: input.method,
            amountReceived: input.amount.toFixed(2),
            reference: input.reference,
        });
        await this.payRepo.save(payment);
        const allocations = input.allocations?.length ? input.allocations : await this.allocateOldestFirst(customer.id, input.amount);
        let remaining = input.amount;
        for (const a of allocations) {
            const inv = await this.invRepo.findOne({ where: { id: a.invoiceId } });
            if (!inv)
                throw new common_1.NotFoundException('Factura no encontrada');
            let apply = Math.min(remaining, a.amount, parseFloat(inv.balance));
            if (apply <= 0)
                continue;
            const alloc = this.allocRepo.create({ payment, invoice: inv, amountApplied: apply.toFixed(2) });
            await this.allocRepo.save(alloc);
            const newBal = (parseFloat(inv.balance) - apply).toFixed(2);
            inv.balance = newBal;
            inv.status = parseFloat(newBal) === 0 ? 'PAGADA' : inv.status;
            await this.invRepo.save(inv);
            remaining -= apply;
        }
        if (remaining > 0) {
            customer.unappliedCredit = (parseFloat(customer.unappliedCredit ?? '0') + remaining).toFixed(2);
            await this.customersService.update(customer.id, { unappliedCredit: customer.unappliedCredit });
        }
        this.events.server?.emit('PaymentRecorded', { paymentId: payment.id, customerId: customer.id });
        return { id: payment.id };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentAllocation)),
    __param(2, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        customers_service_1.CustomersService,
        invoices_service_1.InvoicesService,
        events_gateway_1.EventsGateway])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map