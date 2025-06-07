export declare enum UserRole {
    BUYER = "BUYER",
    SELLER = "SELLER",
    ADMIN = "ADMIN"
}
export declare enum ProjectStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
export declare enum LicenseType {
    SINGLE = "SINGLE",
    MULTI = "MULTI",
    COMMERCIAL = "COMMERCIAL"
}
export declare enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentMethod {
    RAZORPAY = "RAZORPAY",
    UPI = "UPI",
    CARD = "CARD",
    WALLET = "WALLET"
}
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    phone?: string;
    isVerified: boolean;
    isActive: boolean;
    emailVerifiedAt?: Date;
    lastLoginAt?: Date;
}
export interface Project extends BaseEntity {
    title: string;
    description: string;
    shortDescription?: string;
    techStack: string[];
    category: string;
    tags: string[];
    price: number;
    licenseType: LicenseType;
    downloadCount: number;
    viewCount: number;
    rating?: number;
    reviewCount: number;
    status: ProjectStatus;
    isActive: boolean;
    isFeatured: boolean;
    mainFile?: string;
    screenshots: string[];
    demoUrl?: string;
    githubUrl?: string;
    documentation?: string;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    sellerId: string;
    publishedAt?: Date;
}
export interface Transaction extends BaseEntity {
    amount: number;
    currency: string;
    status: TransactionStatus;
    paymentMethod: PaymentMethod;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    buyerId: string;
    sellerId: string;
    projectId: string;
    platformFee: number;
    sellerAmount: number;
    downloadUrl?: string;
    downloadExpiresAt?: Date;
    downloadCount: number;
    completedAt?: Date;
}
export interface Review extends BaseEntity {
    rating: number;
    comment?: string;
    isActive: boolean;
    userId: string;
    projectId: string;
}
export interface ModerationLog extends BaseEntity {
    action: string;
    reason?: string;
    notes?: string;
    moderatorId: string;
    projectId?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface DatabaseStats {
    users: number;
    projects: number;
    transactions: number;
    reviews: number;
    moderationLogs: number;
}
//# sourceMappingURL=database.d.ts.map