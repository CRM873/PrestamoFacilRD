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
exports.InvoicesCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./entities/invoice.entity");
const events_gateway_1 = require("../events/events.gateway");
let InvoicesCronService = class InvoicesCronService {
    invRepo;
    events;
    constructor(invRepo, events) {
        this.invRepo = invRepo;
        this.events = events;
    }
    async accrueDailyInterest() {
        const today = new Date().toISOString().slice(0, 10);
        const list = await this.invRepo.find();
        for (const inv of list) {
            if (parseFloat(inv.balance) <= 0)
                continue;
            if (new Date(inv.dueDate) >= new Date(today))
                continue;
            const last = inv.lastInterestCalcDate ?? inv.dueDate;
            const days = Math.max(0, Math.floor((new Date(today).getTime() - new Date(last).getTime()) / 86400000));
            const rateAnnual = parseFloat(inv.interestRateAnnual ?? '0');
            if (days > 0 && rateAnnual > 0) {
                const dailyRate = rateAnnual / 365;
                const interest = parseFloat(inv.balance) * dailyRate * days;
                inv.balance = (parseFloat(inv.balance) + interest).toFixed(2);
                inv.lastInterestCalcDate = today;
            }
            inv.status = 'VENCIDA';
            await this.invRepo.save(inv);
            this.events.server?.emit('InvoiceOverdue', { invoiceId: inv.id, balance: inv.balance });
        }
    }
};
exports.InvoicesCronService = InvoicesCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoicesCronService.prototype, "accrueDailyInterest", null);
exports.InvoicesCronService = InvoicesCronService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository, events_gateway_1.EventsGateway])
], InvoicesCronService);
//# sourceMappingURL=invoices.cron.js.map