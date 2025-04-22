// pages/_error.tsx
function Error({ statusCode }) {
    return (
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on the server`
          : 'An error occurred on the client'}
      </p>
    );
  }
  
  export default Error;
  