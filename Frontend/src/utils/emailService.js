import emailjs from "@emailjs/browser";

export const sendVerificationEmail = async (userEmail, verifyUrl) => {
  try {
    const templateParams = {
      email: userEmail,
      verifyUrl: verifyUrl,
    };

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_VERIFY_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );
    return result;
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};



export const sendOrderEmail = async (to, order) => {
  const USD_TO_PKR = 280;

  const subtotal = order.totalPrice;
  const deliveryFee = 2.99;
  const tax = subtotal * 0.1;
  const finalTotal = subtotal + deliveryFee + tax;

  const priceInPKR = (finalTotal * USD_TO_PKR).toLocaleString();

  const itemsHtml = order.items
    .map((item) => {
      const lineTotal = (item.quantity * item.food.price).toFixed(2);

      return `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 600;">
        ${item.food.name}
        <br/>
        <span style="color: #94a3b8; font-size: 12px; font-weight: 400;">
          $${item.food.price.toFixed(2)} each
        </span>
      </td>
      
      <td align="center" style="padding: 12px 0; color: #64748b; font-size: 14px;">
        x${item.quantity}
      </td>
      
      <td align="right" style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 700;">
        $${lineTotal}
      </td>
    </tr>
  `;
    })
    .join("");

  const templateParams = {
    email: to,
    order_id: order._id,
    subtotal: subtotal.toFixed(2),
    delivery_fee: deliveryFee.toFixed(2),
    tax: tax.toFixed(2),
    total_usd: finalTotal.toFixed(2),
    total_pkr: priceInPKR,
    items_html: itemsHtml,
  };

  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  );
};
