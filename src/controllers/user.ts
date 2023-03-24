/** src/controllers/users.ts */
import { Request, Response, NextFunction } from 'express';
import PurchaseDTO, { getPurchaseDTO, PaginationModel } from '../dtos/purchase';
import UserDTO, { getUserDTO } from '../dtos/user';

// Singleton service instance, cached by Node.js module system
const service =  require('../service')

/**
 * This method returns a unique user, since the service doesn't support multiple users
 * @param req The request including params, on this case we ignore it because we only have one user
 * @param res Returns an userDTO and 200 code if successful, else returns an error
 * @param next Handled at server side
 */
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    service.instance.getUser()
        .then((data: JSON) => data)
        .then((userData: any) => {
            return Promise.all([
                service.instance.getUserRestrictions(userData.id_usuario),
                service.instance.getLevel(userData.nivel)
            ])
            .then((values: any[]) => {
                return {
                    userData,
                    userRestrictions: values[0],
                    level: values[1]
                }
            })
            .catch((e: any) => console.log(e))
        })
        .then((data: any) => {
            const { userData, userRestrictions, level} = data;
            const userDTO: UserDTO = getUserDTO(userData, userRestrictions, level)
            return res.status(200).json(userDTO)
        })
        .catch((e: any) => {
            return res.status(404).json({
                message: e.message
            });
        })
};

/**
 * Given an userId it returns its purchases
 * @param req The userId is passed on the request on this format: <id>
 * @param res Returns an array of purchaseDTOs and 200 code if successful, else returns an error
 * @param next Handled at server side
 */
const getUserPurchases = (req: Request, res: Response, next: NextFunction) => {
    const { id: userId, limit, page } = req.params
    let pageLimit: number | undefined = limit ? +limit : undefined
    let pageNumber: number | undefined = page ? + page : undefined
    let paginationData: PaginationModel
    service.instance.getUserPurchases(userId, pageLimit, pageNumber)
        .then((data: JSON) => data)
        .then((purchases: any) => {
            const { total, offset, limit } = purchases
            paginationData = {
                total,
                offset,
                limit
            }
            return Promise.all(
                purchases.data.map((p: any) => {
                return Promise.all([
                    service.instance.getPayment(p.id_transaccion),
                    service.instance.getShipment(p.id_envio)
                ])
                .then((values: any[]) => {
                    return {
                        purchase: p,
                        payment: values[0],
                        shipment: values[1]
                    }
                })
                .catch((e: any) => console.log(e))
            })).then(d =>  {
                return d
            })
        })
        .then((purchases: any) => {
            const purchaseDTOs: PurchaseDTO[] = purchases.map((p: any) => {
                const { purchase, payment, shipment} = p;
                return getPurchaseDTO(purchase, payment, shipment)
            });

            const result = {
                purchases: purchaseDTOs,
                paginationData
            }
                
            return res.status(200).json(result)
        })
        .catch((e: any) => {
            return res.status(404).json({
                message: e.message
            });
        })
};

export default { getUser, getUserPurchases };