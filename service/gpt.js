import axios from "axios";

const OPENAI_API_KEY = " ";

export async function askGpt(message) {
  const systemPrompt = `
  Ти є асистентом магазину. В тебе є структура даних про товари, доставки, історію, замовлення.
  Відповідай лише у форматі JSON з інструкцією, наприклад:
  {
    "action": "get_product_quantity",
    "product": "Кава Lavazza"
  }
  Або:
  {
    "action": "get_last_delivery_date",
    "product": "Кава Lavazza"
  }
  Якщо не можеш виконати запит — поверни:
  {
    "action": "unknown"
  }
  `;

  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return res.data.choices[0].message.content;
}
