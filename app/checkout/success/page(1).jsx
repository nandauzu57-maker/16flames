export default function CheckoutSuccess(){
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:30,fontFamily:"Arial,sans-serif",background:"#fff5fb"}}>
    <section style={{maxWidth:620,textAlign:"center",background:"white",padding:48,boxShadow:"0 20px 60px rgba(0,0,0,.12)"}}>
      <div style={{fontSize:54}}>✦</div><h1 style={{fontSize:42,margin:"10px 0"}}>PAYMENT COMPLETE</h1>
      <p style={{fontSize:17,lineHeight:1.7,color:"#555"}}>Thank you for your order. PayPal has completed the payment. Keep your PayPal receipt/order ID for your records.</p>
      <a href="/" style={{display:"inline-block",marginTop:20,padding:"14px 22px",background:"#111",color:"white",textDecoration:"none"}}>BACK TO SHOP</a>
    </section>
  </main>
}
