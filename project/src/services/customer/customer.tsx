import { supabase } from "@/lib/supabaseClient";

//get the customer by their email address
export async function getCustomerByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from("customer")
      .select("*")
      .eq("email", email);

    if (error) throw error;
    if (!data) throw new Error("Failed to get customer: No data returned");

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//create new customer
export async function createCustomer(customer: {
  email: string;
  name: string;
  phone: string;
}) {
  try {
    const { data, error } = await supabase
      .from("customer")
      .insert([customer])
      .select("*");

    if (error) throw error;
    if (!data) throw new Error("Failed to create customer: No data returned");

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
