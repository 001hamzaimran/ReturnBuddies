import axios from "axios";
import pickupModel from "../models/pickup.model.js";

const BASE_URL = "https://planning-service.beta.routific.com/v1";
const ROUTIFIC_TOKEN = process.env.ROUTIFIC_AUTHENTICATION_TOKEN;

// Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ROUTIFIC_TOKEN}`, // ✅ fixed backticks
    "Content-Type": "application/json",
  },
});

export const getRoutificOrders = async (workspaceId, date) => {
  try {
    // 1️⃣ Fetch all routes for workspace & date
    const routeRes = await api.get(
      `/routes?workspaceId=${workspaceId}&date=${date}`
    );
    const routes = routeRes.data.data;
    if (!routes?.length) return [];

    const allOrders = [];

    // 2️⃣ For each route, fetch its timeline
    for (const route of routes) {
      const routeUuid = route.uuid;
      const timelineRes = await api.get(`/routes/${routeUuid}/timeline`);
      const stops = timelineRes.data.data;

      // 3️⃣ For each stop, fetch each order
      for (const stop of stops) {
        if (stop.orders?.length) {
          for (const order of stop.orders) {
            const orderUuid = order.uuid;
            const orderRes = await api.get(`/orders/${orderUuid}`);
            const orderData = orderRes.data;

            // ✅ Only push delivered orders
            if (orderData.status?.toLowerCase() === "delivered") {
              allOrders.push({
                customerOrderNumber: orderData.customerOrderNumber,
                status: orderData.status,
              });
            }
          }
        }
      }
    }

    // extract customerOrderNumbers of delivered orders
    const deliveredOrderNumbers = allOrders.map(
      (order) => order.customerOrderNumber
    );

    // ✅ fetch pickups whose PickupName is in deliveredOrderNumbers
    const pickups = await pickupModel.find({
      PickupName: { $in: deliveredOrderNumbers },
    });

    console.log(`Fetched ${pickups.length} delivered pickups from Routific.`);

    // ✅ Update each pickup if status === "Pickup Requested"
    for (const pickup of pickups) {
      if (pickup.status === "Pickup Requested") {
        // update status
        pickup.status = "Picked Up";

        // push to statusHistory
        pickup.statusHistory.push({
          type: "status",
          status: "Picked Up",
          updatedAt: new Date(),
        });

        await pickup.save();
        console.log(`Pickup ${pickup.PickupName} updated to 'Picked Up'.`);
      }
    }

    return pickups;
  } catch (error) {
    console.error(
      "Error fetching Routific orders:",
      error.response?.data || error.message
    );
    return [];
  }
};
