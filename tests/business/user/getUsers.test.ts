import { UserBusiness } from "../../../src/business/UserBusiness"
import { GetUsersSchema } from "../../../src/dtos/user/getUsers.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { USER_ROLES } from "../../../src/models/User"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando getUsers", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve retornar lista de todos users", async () => {
    const input = GetUsersSchema.parse({
      token: "token-mock-astrodev"
    })

    const output = await userBusiness.getUsers(input)

    expect(output).toHaveLength(2)
    expect(output).toEqual([
      {
        id: "id-mock-fulano",
        name: "Fulano",
        email: "fulano@email.com",
        createdAt: expect.any(String),
        role: USER_ROLES.NORMAL
      },
      {
        id: "id-mock-astrodev",
        name: "Astrodev",
        email: "astrodev@email.com",
        createdAt: expect.any(String),
        role: USER_ROLES.ADMIN
      },
    ])
  })

  // deve retornar erro de token invalido 

  test("deve retornar erro token invalido user", async () => {
    expect.assertions(1)
    try {
      const input = GetUsersSchema.parse({
        token: "token-mock-astrodevERRO"
      })
      await userBusiness.getUsers(input)
      
    } catch (error) {
      if (error instanceof BadRequestError ) {            
        expect(error.message).toBe("token inválido")
      }
    }
  });

  // erro com token de user.NORMAL
  test("deve verificar erro somente ADMIN tem podem acessar ", async () => {
    expect.assertions(1)
    try {
      const input = GetUsersSchema.parse({       
        token: "token-mock-fulano"
      })
      await userBusiness.getUsers(input)
      
    } catch (error) {
      if (error instanceof BadRequestError ) {            
        expect(error.message).toBe("somente admins podem acessar")
      }
    }
  });
})