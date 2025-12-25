import pendingBooking from "../models/pendingBooking.model.js";
import query from "../models/query.model.js"

export const sendQuery = async (req, res) => {
    const { clientName, email, phone, eventName, eventDate, budget, message, pax } = req.body;

    // Save directly

    try {
        const newQuery = new query({
            clientName,
            email,
            phone,
            eventName,
            eventDate,
            budget,
            message,
            pax
        });

        await newQuery.save()
        res.status(201).json({
            message: "Query Send Successfully!"
        })
    } catch (error) {
        console.log("Error Sending the Query ", error);
        res.status(500).json({
            message: "Internal Server Error"
        })

    }
}

export const sendBookingRequest = async (req, res) => {
    try {
        const data = req.body
        console.log("Received booking data: ", data);
        if (!data.personal || !data.event || !data.menu) {
            return res.status(400).json({
                message: "Missing required booking sections (personal, event, or menu).",
            });
        }
        const newBooking = new pendingBooking({
            clientDetails: {
                fullName: data.personal.fullName,
                email: data.personal.email,
                phone: data.personal.phone,
            },
            eventDetails: {
                eventName: data.event.eventName,
                eventDate: data.event.date,
                eventTime: data.event.time,
                pax: data.event.guests,
                venue: data.event.venue,
                notes: data.event.notes,
            },
            menu: {
                starters: data.menu.selectedItems.appetizers || [],
                maincourse: data.menu.selectedItems.mains || [],
                beverages: data.menu.selectedItems.beverages || [],
                desserts: data.menu.selectedItems.desserts || [],
            },
            estimatedAmount: data.menu.estimatedPrice || 0,
            priority: "Medium", // default priority
            status: "Pending", // default
        });
        console.log(newBooking)
        await newBooking.save()

        res.status(201).json({
            message:"Booking submitted successfully!",
        })
    } catch (error) {
        console.log("Error creating pending booking: ",error);
        res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
        
    }
}