export default function CheckoutCancel(){
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:30,fontFamily:"Arial,sans-serif",background:"#fff5fb"}}>
    <section style={{maxWidth:620,textAlign:"center",background:"white",padding:48,boxShadow:"0 20px 60px rgba(0,0,0,.12)"}}>
      <div style={{fontSize:54}}>♡</div><h1 style={{fontSize:42,margin:"10px 0"}}>PAYMENT CANCELLED</h1>
      <p style={{fontSize:17,lineHeight:1.7,color:"#555"}}>Your payment was cancelled. No charge was captured. You can return to the store and try again.</p>
      <a href="/" style={{display:"inline-block",marginTop:20,padding:"14px 22px",background:"#111",color:"white",textDecoration:"none"}}>RETURN TO SHOP</a>
    </section>
  </main>
}
