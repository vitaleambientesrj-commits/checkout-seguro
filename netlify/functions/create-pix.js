export default async (request) => {
  try {
    const secret = Netlify.env.get("HYPERCASH_SECRET_KEY");

    if (!secret) {
      return new Response(JSON.stringify({ erro: "Chave secreta não configurada" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    const basic = Buffer.from(`x:${secret}`).toString("base64");

    const response = await fetch("https://api.hypercashbrasil.com.br/api/user/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basic}`
      },
      body: JSON.stringify({
        amount: body.amount,
        paymentMethod: "PIX",
        customer: {
          name: "Cliente Vitale",
          email: "cliente@exemplo.com",
          document: {
            number: "12345678900",
            type: "CPF"
          },
          phone: "21999999999",
          externaRef: "cliente-001"
        },
        shipping: {
          fee: 0,
          address: {
            street: "Rua Exemplo",
            streetNumber: "100",
            complement: "Casa",
            zipCode: "25900000",
            neighborhood: "Centro",
            city: "Teresopolis",
            state: "RJ",
            country: "br"
          }
        },
        items: [
          {
            title: body.description,
            unitPrice: body.amount,
            quantity: 1,
            tangible: true,
            externalRef: "proj-001"
          }
        ],
        traceable: true,
        ip: "127.0.0.1",
        pix: {
          expiresInDays: 1
        }
      })
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ erro: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
