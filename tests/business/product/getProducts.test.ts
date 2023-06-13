import { ProductBusiness } from "../../../src/business/ProductBusiness";
import { GetProductsSchema } from "../../../src/dtos/product/getProducts.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Testando getProducts", () => {
  const productBusiness = new ProductBusiness(
    new ProductDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  // Teste 1 retornar produtos 
  test("deve retornar token", async () => {
    const input = GetProductsSchema.parse({
      token: "token-mock-astrodev",
    });
    const output = await productBusiness.getProducts(input);
    // console.log(output);
    expect(output).toHaveLength(2);
    expect(output).toContainEqual({
      id: "p001",
      name: "Mouse",
      price: 50,
      createdAt: expect.any(String),
    });
  });
  // teste 2 Token invalido getProducts
  test("deve retornar erro token invalido", async () => {
    expect.assertions(1)
    try {
      const input = GetProductsSchema.parse({
        token: "token-mock-astrodev2"
      })
      await productBusiness.getProducts(input)
      
    } catch (error) {
      if (error instanceof BadRequestError ) {            
        expect(error.message).toBe("token inválido")
      }
    }
  });

  
});
