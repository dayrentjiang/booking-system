import { BookingFormData } from "@/types/interface";
import {
  getCustomerByEmail,
  createCustomer
} from "@/services/customer/customer";
import { createNewBooking } from "@/services/booking/booking";
import { format } from "date-fns";

export async function addNewBooking(formData: BookingFormData) {
  console.log("from the ser ver:", formData);

  const {
    customerInfo,
    venueId,
    courtId,
    date,
    isRecurring,
    recurringEndDate,
    timeSlots,
    estimatedPrice
  } = formData;

  //work on the customer first, get the customer id if it exists. if no customer, create a new one and return the id
  let customerId = null;
  const customerData = await getCustomerByEmail(customerInfo.email);
  if (customerData) {
    console.log(customerData);
    customerId = customerData[0].id;
  }
  if (!customerId) {
    console.log("Creating new customer");
    //create new customer
    //insert customer on this format
    const newCustomer = await createCustomer(customerInfo);
    console.log(newCustomer);
    customerId = newCustomer[0].id;
  }

  console.log("Customer ID:", customerId);

  //work on the booking
  if (!date) {
    return;
  }
  const dateOnly = format(date, "yyyy-MM-dd");
  const bookingData = {
    customer_id: customerId,
    court_id: courtId,
    start_time: dateOnly + " " + timeSlots[0].split("-")[0],
    end_time: dateOnly + " " + timeSlots[timeSlots.length - 1].split("-")[1],
    total_amount: estimatedPrice,
    is_recurring: isRecurring,
    recurring_end_date: recurringEndDate
  };

  const newBooking = await createNewBooking(bookingData);
  console.log(newBooking);
}
