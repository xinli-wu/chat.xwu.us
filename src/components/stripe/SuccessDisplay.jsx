import React from 'react';

// const { VITE_CHAT_API_URL } = import.meta.env;

function SuccessDisplay() {
  return (
    <section>
      <div className="product Box-root">
        <div className="description Box-root">
          <h3>Subscription to starter plan successful!</h3>
        </div>
      </div>
      {/* <form action={VITE_CHAT_API_URL + "/create-portal-session"} method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form> */}
    </section>
  );
}

export default SuccessDisplay;
