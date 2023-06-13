import { ZodError } from "zod";
import { ProductBusiness } from "../../../src/business/ProductBusiness";
import { CreateProductSchema } from "../../../src/dtos/product/createProduct.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Teste para create Products", () => {
  const productBusiness = new ProductBusiness(
    new ProductDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar item criado com sucesso", async () => {
    expect.assertions(2);
    const input = CreateProductSchema.parse({
      name: "item de teste",
      price: 390,
      token: "token-mock-astrodev",
    });
    const output = await productBusiness.createProduct(input);
    expect(output.message).toBe("Producto cadastrado com sucesso");
    expect(output.product).toEqual({
      id: "id-mock",
      name: "item de teste",
      price: 390,
      createdAt: expect.any(String),
    });
  });
  test("deve verificar erro de token invalido", async () => {
    expect.assertions(1)
    try {
      const input = CreateProductSchema.parse({
        name:'item de teste',
        price:123,
        token: "token-mock-astrodevERRO"
      })
      await productBusiness.createProduct(input)
      
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
      const input = CreateProductSchema.parse({
        name:'item de teste',
        price:123,
        token: "token-mock-fulano"
      })
      await productBusiness.createProduct(input)
      
    } catch (error) {
      if (error instanceof BadRequestError ) {            
        expect(error.message).toBe("somente admins podem acessar")
      }
    }
  });
});
