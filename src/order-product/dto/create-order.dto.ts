export class CreateOrderDto {
    delivery_address_id:number;
    use_any_coupon?:boolean;
    products: CreateOrderProductDto[];
}

export class CreateOrderProductDto {
    product_id:number;
    unit_quantity:number;
}
