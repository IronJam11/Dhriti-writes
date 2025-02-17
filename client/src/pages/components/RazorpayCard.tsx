import Axios from "axios";
import React, { useState, useEffect } from "react";
import { BACKEND_ENDPOINT } from "../../constants/endpoints";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorPayCard: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load the Razorpay script when component mounts
    const loadRazorpayScript = async () => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        setScriptLoaded(true);
        return;
      }

      try {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error loading Razorpay script:", error);
      }
    };

    loadRazorpayScript();
  }, []);

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      console.log("Payment successful, response:", response);
      const bodyData = new FormData();
      bodyData.append("response", JSON.stringify(response));

      const result = await Axios.post(`${BACKEND_ENDPOINT}/payment/users/success/`, bodyData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Payment verification successful:", result.data);
      alert("Payment successful!");
      setName("");
      setAmount("");
    } catch (error) {
      console.error("Error during payment verification:", error);
      alert("Payment successful, but verification failed. Please contact support.");
    }
  };

  const showRazorpay = async () => {
    if (!scriptLoaded) {
      alert("Razorpay script is still loading. Please try again in a moment.");
      return;
    }

    if (!name || !amount) {
      alert("Please fill in both product name and amount");
      return;
    }

    try {
      // Create a form data object to send to your backend
      const bodyData = new FormData();
      bodyData.append("amount", amount);
      bodyData.append("name", name);

      // Make a request to your backend to create an order
      const response = await Axios.post(`${BACKEND_ENDPOINT}/users/pay/`, bodyData, {
        headers: {
          Accept: "application/json",
        },
      });


      if (!response.data || !response.data.payment || !response.data.payment.id) {
        console.error("Invalid response from server:", response.data);
        alert("Could not create payment order. Please try again later.");
        return;
      }

      console.log("Order created:", response.data);
     

      const options = {
        key: process.env.REACT_APP_PUBLIC_KEY,
        amount: response.data.payment.amount,
        currency: "INR",
        name: "Org. Name",
        description: "Payment for " + name,
        image: "", // Add your logo URL here
        order_id: response.data.payment.id,
        handler: function(response: RazorpayResponse) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: "User's name",
          email: "User's email",
          contact: "User's phone",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
          }
        }
      };

      // Initialize Razorpay
      if (window.Razorpay) {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Could not initiate payment. Please try again later.");
    }
  };

  return (
    <div className="container" style={{ marginTop: "20vh" }}>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Payment page</h1>

        <div className="form-group">
          <label htmlFor="name">Product name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            pattern="[0-9]*"
            required
          />
        </div>
      </form>
      <button
        onClick={showRazorpay}
        className="btn btn-primary btn-block"
        disabled={!scriptLoaded || !name || !amount}
      >
        {scriptLoaded ? "Pay with Razorpay" : "Loading Razorpay..."}
      </button>
    </div>
  );
};

export default RazorPayCard;