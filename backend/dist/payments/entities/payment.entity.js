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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentAllocation = exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../../customers/entities/customer.entity");
const invoice_entity_1 = require("../../invoices/entities/invoice.entity");
let Payment = class Payment {
    id;
    customer;
    method;
    amountReceived;
    reference;
    allocations;
    createdAt;
    updatedAt;
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { eager: true, onDelete: 'RESTRICT' }),
    __metadata("design:type", customer_entity_1.Customer)
], Payment.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], Payment.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2 }),
    __metadata("design:type", String)
], Payment.prototype, "amountReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 64 }),
    __metadata("design:type", String)
], Payment.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PaymentAllocation, (a) => a.payment, { cascade: true }),
    __metadata("design:type", Array)
], Payment.prototype, "allocations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Payment.prototype, "updatedAt", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)('payments')
], Payment);
let PaymentAllocation = class PaymentAllocation {
    id;
    payment;
    invoice;
    amountApplied;
};
exports.PaymentAllocation = PaymentAllocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentAllocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Payment, (p) => p.allocations, { onDelete: 'CASCADE' }),
    __metadata("design:type", Payment)
], PaymentAllocation.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invoice_entity_1.Invoice, { eager: true, onDelete: 'RESTRICT' }),
    __metadata("design:type", invoice_entity_1.Invoice)
], PaymentAllocation.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2 }),
    __metadata("design:type", String)
], PaymentAllocation.prototype, "amountApplied", void 0);
exports.PaymentAllocation = PaymentAllocation = __decorate([
    (0, typeorm_1.Entity)('payment_allocations')
], PaymentAllocation);
//# sourceMappingURL=payment.entity.js.map