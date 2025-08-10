import orderItem from "../models/orderItem.js";
import Order from "../models/order.js"; // ✅ Correct name and path
import sendEmail from "../util/sendEmail.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order cannot be empty." });
    }

    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
    });

    await newOrder.save();

    const itemListHtml = await Promise.all(
      items.map(async ({ foodItemId, quantity }) => {
        const food = await orderItem.findById(foodItemId);
        return `<li>${food.name} x ${quantity} — ₦${food.price * quantity}</li>`;
      })
    );

    const userEmail = req.user.email || req.body.email;

    const message = `
      <h2>Order Confirmation</h2>
      <p>Thank you for ordering from delish Restaurant!</p>
      <p><strong>Order ID:</strong> ${newOrder._id}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${itemListHtml.join("")}
      </ul>
      <p><strong>Total:</strong> ₦${totalAmount}</p>
      <p>We'll start preparing your food immediately. You'll be notified once it's out for delivery.</p>
      <p>Enjoy your meal!</p>
    `;

    await sendEmail(userEmail, "Order Confirmation - Delish Restaurant", message);

    return res.status(201).json({
      message: "Order placed successfully. Confirmation email sent.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order placement failed:", error);
    return res.status(500).json({ error: "Server error while placing order" });
  }
};

export const fetchCert = async (req, res) => {
  try {
    let user = await Order.find().select(
      "userId items totalAmount"
    )

    return res

  }
}
