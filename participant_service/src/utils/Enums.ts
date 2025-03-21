export enum ParticipantStatus {

Active = "ACTIVE",
Inactive = "INACTIVE",
Suspended = "SUSPENDED"

}

export enum Status {

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

export enum Method {

    GET="GET",
    POST="POST",
    DELETE= "DELETE",
    PUT="PUT",
    PATCH="PATCH",
    OPTIONS="OPTIONS"
}

export enum ActionValues { 

    UPLOAD_PARTICIPANT_DATA = "UPLOAD_PARTICIPANT_DATA",
    UPLOAD_CUSTOMER_DATA = "UPLOAD_CUSTOMER_DATA",
    UPLOAD_ACCOUNT_DATA = "UPLOAD_ACCOUNT_DATA",
    UPLOAD_TRANSACTION_DATA = "UPLOAD_TRANSACTION_DATA",
    CREATE_USER_ASSIGN= "CREATE_USER_ASSIGN",
    READ= "READ",
    READ_ACCOUNT_DATA="READ_ACCOUNT_DATA",
    READ_CUSTOMER_DATA="READ_CUSTOMER_DATA",
    READ_TRANSACTION_DATA="READ_TRANSACTION_DATA",
    UPDATE= "UPDATE",
    DELETE= "DELETE",
    SIGN_IN= "SIGN_IN",
    SIGN_OUT= "SIGN_OUT",
    SUSPEND= "SUSPEND"

}
export function getEnumValues(enumObj: any): string[] {
    return Object.values(enumObj);
}

// Example usage:

export enum UserRole { 
    
    ADMIN= "ADMIN",
    INVESTIGATOR= "INVESTIGATOR",
    REGULATOR= "REGULATORY_OFFICER",
    CHIEF= "CHIEF",
    MANAGER= "MANAGER", 
    
}