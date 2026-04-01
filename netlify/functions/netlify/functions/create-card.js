export default async (request) => {
  try {
    const secret = Netlify.env.get("sk_6d60f27eb8ae7058f15c01261f4e3feea7d1f315");

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
        paymentMethod: "CREDIT_CARD",
        installments: body.installments || 1,
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
        items: [
          {
            title: body.description,
            unitPrice: body.amount,
            quantity: 1,
            tangible: true,
            externalRef: "proj-001"
          }
        ],
        card: {
          token: body.cardToken
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
