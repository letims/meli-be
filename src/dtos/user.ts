/** src/dtos/user.ts */
/**
 * Data Transfer Object for the user
 */
export default interface UserDTO {
  id: number,
  firstName: string,
  lastName: string,
  imageSrc: string,
  level: string,
  restrictions: string[],
}

/**
 * Returns an user object which represents all the information the API consumer client needs
 * @param profile user profile holding their basic info
 * @param restrictions user restrictions such as issues or actions to be performed
 * @param level user level within the Mercado Libre ranking
 * @returns An userDTO encapsulating their profile, restrictions and level
 */
export function getUserDTO(profile: any, restrictions: any[], level: any): UserDTO {
  const { id_usuario: id, nombre: firstName, apellido: lastName, imagen: imageSrc } = profile
  const { descripción: userLevel } = level
  return {
    id,
    firstName,
    lastName,
    imageSrc,
    level: userLevel,
    restrictions: restrictions.length > 0 ? restrictions.map(r => r.mensaje) : []
  }
}
