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
exports.NcfSeries = void 0;
const typeorm_1 = require("typeorm");
let NcfSeries = class NcfSeries {
    id;
    typeCode;
    prefix;
    current;
    end;
    expiresAt;
    active;
    createdAt;
    updatedAt;
};
exports.NcfSeries = NcfSeries;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NcfSeries.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type_code', length: 8 }),
    __metadata("design:type", String)
], NcfSeries.prototype, "typeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], NcfSeries.prototype, "prefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], NcfSeries.prototype, "current", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], NcfSeries.prototype, "end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], NcfSeries.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], NcfSeries.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NcfSeries.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], NcfSeries.prototype, "updatedAt", void 0);
exports.NcfSeries = NcfSeries = __decorate([
    (0, typeorm_1.Entity)('ncf_series'),
    (0, typeorm_1.Index)(['typeCode', 'active'], { unique: true, where: 'active = 1' })
], NcfSeries);
//# sourceMappingURL=ncf-series.entity.js.map