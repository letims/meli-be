/** src/dtos/purchase.ts */
/**
 * Data Transfer Object for a purchase
 */
export default interface PurchaseDTO {
  id: number,
  itemTitle: string,
  imageSrc: string,
  vendorName: string,
  vendorId: string,
  date: Date,
  price: number,
  currency: string,
  amount: number,
  paymentStatus: string,
  shipmentStatus: string,
}

export interface PaginationModel {
  total: number;
  offset: number;
  limit: number;
}

/**
 * Returns a purchase object which represents all the information the API consumer client needs
 * @param purchaseData purchase basic info
 * @param payment purchase payment info which includes code and status
 * @param shipment purchase shipment info which includes code and status
 * @returns An userDTO encapsulating their basic info, payment and shipment status
 */
export function getPurchaseDTO(purchaseData: any, payment: any, shipment: any): PurchaseDTO {
  const { id_compra: id, titulo: itemTitle, precio, imagen: imageSrc, cantidad: amount, fecha: purchaseDate, vendedor } = purchaseData
  const { total: price, moneda: currency} = precio
  const { id: vendorId, nickname: vendorName} = vendedor
  const { estado: paymentStatus } = payment
  const { estado: shipmentStatus } = shipment
  return {
    id,
    itemTitle,
    amount,
    date: new Date(purchaseDate),
    price,
    currency,
    imageSrc,
    vendorId,
    vendorName,
    paymentStatus,
    shipmentStatus
  }
}