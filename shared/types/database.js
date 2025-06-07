"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.TransactionStatus = exports.LicenseType = exports.ProjectStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["BUYER"] = "BUYER";
    UserRole["SELLER"] = "SELLER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "DRAFT";
    ProjectStatus["PENDING"] = "PENDING";
    ProjectStatus["APPROVED"] = "APPROVED";
    ProjectStatus["REJECTED"] = "REJECTED";
    ProjectStatus["SUSPENDED"] = "SUSPENDED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var LicenseType;
(function (LicenseType) {
    LicenseType["SINGLE"] = "SINGLE";
    LicenseType["MULTI"] = "MULTI";
    LicenseType["COMMERCIAL"] = "COMMERCIAL";
})(LicenseType || (exports.LicenseType = LicenseType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["REFUNDED"] = "REFUNDED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["RAZORPAY"] = "RAZORPAY";
    PaymentMethod["UPI"] = "UPI";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["WALLET"] = "WALLET";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
//# sourceMappingURL=database.js.map