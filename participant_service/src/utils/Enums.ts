export enum ParticipantStatus {

Active = "ACTIVE",
Inactive = "INACTIVE",
Suspended = "SUSPENDED"

 }

export enum ParticipantType {

FinancialInstitution = "FINANCIAL INSTITUTION",
Regulator = "REGULATOR",
Other = "OTHER"

}

export enum CustomerKYCStatus {

Active = "ACTIVE",
Inactive = "INACTIVE",
Suspended = "SUSPENDED"

}

export enum AccountStatus  {

    Active = "ACTIVE",
    Close = "CLOSE",
    Suspended = "SUSPENDED"


}

export enum AccountType {

    Checking = "CHECKING",
    Saving = "SAVING"

}

export enum TransactionType {
    Deposit = "DEPOSIT",
    Withdrawal = "WITHDRAWAL",
    Transfer = "TRANSFER"
}

export enum TransactionStatus {
    Pending = "PENDING",
    Completed = "COMPLETED",
    Failed = "FAILED"
}

export enum TransactionPaymentMethod {
    Card = "CARD",
    Check = "CHECK",
    Transfer = "TRANSFER"
}