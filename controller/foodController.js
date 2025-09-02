import FoodItem from "../models/foodItem.js";
import Order from "../models/order.js";
import sendEmail from "../util/sendEmail.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order cannot be empty." });
    }

    let newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
    });

    await newOrder.save();
    newOrder = await newOrder.populate("items.foodItemId", "name price");

    const itemListHtml = newOrder.items.map(
      ({ foodItemId, quantity }) =>
        `<li>${foodItemId.name} x ${quantity} — ₦${foodItemId.price * quantity}</li>`
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
    const orders = await Order.find({ userId: req.user.id }) 
      .select("items totalAmount status createdAt")
      .populate("items.foodItemId", "name price"); 

    return res.status(200).json({
      message: "Your orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Server error while fetching orders" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;   // order ID from URL
    const { status } = req.body;      // new status from request body

    const validStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } 
    ).populate("items.foodItemId", "name price");

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.status(200).json({
      message: `Order status updated to '${status}'.`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Server error while updating order status." });
  }
};

