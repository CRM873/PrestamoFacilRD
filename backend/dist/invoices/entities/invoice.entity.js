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
exports.Invoice = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../../customers/entities/customer.entity");
let Invoice = class Invoice {
    id;
    customer;
    ncfType;
    ncfNumber;
    issueDate;
    dueDate;
    subtotal;
    itbisTotal;
    total;
    balance;
    status;
    interestRateAnnual;
    lastInterestCalcDate;
    createdAt;
    updatedAt;
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { eager: true, onDelete: 'RESTRICT' }),
    __metadata("design:type", customer_entity_1.Customer)
], Invoice.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncf_type', nullable: true, length: 8 }),
    __metadata("design:type", String)
], Invoice.prototype, "ncfType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncf_number', nullable: true, length: 20 }),
    __metadata("design:type", String)
], Invoice.prototype, "ncfNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Invoice.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2 }),
    __metadata("design:type", String)
], Invoice.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2 }),
    __metadata("design:type", String)
], Invoice.prototype, "itbisTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2 }),
    __metadata("design:type", String)
], Invoice.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2 }),
    __metadata("design:type", String)
], Invoice.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4, default: 0 }),
    __metadata("design:type", String)
], Invoice.prototype, "interestRateAnnual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "lastInterestCalcDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)('invoices'),
    (0, typeorm_1.Index)(['ncfNumber'], { unique: true, where: 'ncf_number IS NOT NULL' })
], Invoice);
//# sourceMappingURL=invoice.entity.js.map