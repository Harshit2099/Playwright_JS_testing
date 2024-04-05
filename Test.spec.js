const {test, expect, request} = require("@playwright/test");


let token;
let order_ID;
test.beforeAll(async()=>
{
  const payload_login = {userEmail: "testing.practice@tafmail.com",userPassword:"Welcome@123"}
  const payload_create_order = {orders: [{country: "India", productOrderedId: "6581ca399fd99c85e8ee7f45"}]}  
  const api = await request.newContext();
  const response = await api.post("https://rahulshettyacademy.com/api/ecom/auth/login",{data:payload_login});
  await expect(response.ok()).toBeTruthy();
  const login_json = await response.json();
  token = login_json.token;
  await console.log(token);
  // To create order
  const create_order_response = await api.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
  {data:payload_create_order,headers:{'Authorization':token,'Content-Type':'application/json'}});
  const order_json = await create_order_response.json();
  order_ID = await order_json.orders[0];
  await console.log(order_ID);
  // To delete order
  const delete_order_response = await api.delete('https://rahulshettyacademy.com/api/ecom/order/delete-order/'+order_ID+'',
  {headers:{'Authorization':token}});
  const delete_json = await delete_order_response.json();
  const delete_message = await delete_json.message;
  await console.log(delete_message);
  // To get order details
  const get_order_response = await api.get('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6595f1149fd99c85e8fd30f6',
  {headers:{'Authorization':token}});
  const get_json = await get_order_response.json();
  const get_message = await get_json.message;
  await console.log(get_message);
});


test.skip('abort api calls home page',async ({page})=>
{
  // setItem('token') = token key present in the applicaiton->local storage->token
  // token at the end is the argument that we got from json.token (refer beforeAll)
  await page.addInitScript(value=>{window.localStorage.setItem('token',value)},token);        
  
  await page.route('**/*.{css,jpg,jpeg}',async route=>route.abort());
  await page.goto("https://rahulshettyacademy.com/client/");   
  await page.locator("//*[contains(text(),'ORDERS')]").click();
  await page.locator("(//button[text()='View'])[1]").click();

  await page.pause();

});


test('view orders incercept with different order response',async ({page})=>
{
  // setItem('token') = token key present in the applicaiton->local storage->token
  // token at the end is the argument that we got from json.token (refer beforeAll)
  await page.addInitScript(value=>{window.localStorage.setItem('token',value)},token);          
  await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=660f6e2da86f8f74dcb7e20c',
  async route=>route.continue({url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=65a752a49fd99c85e80c15fd'}));
  await page.goto("https://rahulshettyacademy.com/client/");   
  await page.locator("//*[contains(text(),'ORDERS')]").click();
  await page.locator("(//button[text()='View'])[1]").click();

  await page.pause();

});



test.skip('my orders incercept with fake response',async ({page})=>
{
  // setItem('token') = token key present in the applicaiton->local storage->token
  // token at the end is the argument that we got from json.token (refer beforeAll)
  await page.addInitScript(value=>{window.localStorage.setItem('token',value)},token);        

  let body = {data:[],message:"No Orders"};
  await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6595f1149fd99c85e8fd30f6',
  async route=>
  {
    route.fulfill({response:body});
  });
  await page.goto("https://rahulshettyacademy.com/client/");   
  await page.locator("//*[contains(text(),'ORDERS')]").click();
  await page.pause();

});


test.skip('playwright title',async ({page})=>
{
  // setItem('token') = token key present in the applicaiton->local storage->token
  // token at the end is the argument that we got from json.token (refer beforeAll)
  await page.addInitScript(value=>{window.localStorage.setItem('token',value)},token);  
  await page.goto("https://rahulshettyacademy.com/client/");     
  let OID = order_ID;    
  await page.locator("//*[contains(text(),'ORDERS')]").click();
  await page.waitForTimeout(2000);
  const OID_visibility_after_delete = await page.locator('//*[text()="'+OID+'"]').isVisible();  
  await expect(OID_visibility_after_delete).toBeFalsy();
  await page.pause();

});



test.skip('client app normal flow',async ({page})=>
{
  // setItem('token') = token key present in the applicaiton->local storage->token
  // token at the end is the argument that we got from json.token (refer beforeAll)
  await page.addInitScript(value=>{window.localStorage.setItem('token',value)},token);  
  await page.goto("https://rahulshettyacademy.com/client/");     
  
  await page.waitForLoadState("networkidle");
  const product = await page.locator(".card-body");
  const productcount = await product.count();
  for (let i=0; i < productcount; i++) 
  {
    let itext =  await product.locator("h5").nth(i).textContent();
    if (itext === "ZARA COAT 3")
    {
    await product.locator(":nth-child(4)").nth(i).click();
    break;
    }    
  }

  await page.locator("[routerlink$='cart']").click();  
  await page.locator("p.itemNumber").first().waitFor();
  await page.locator("//*[text()='Checkout']").click();
  
  // payment method details
  await page.locator("input.text-validated").first().fill("4542 9931 9292 2293");
  await page.locator(".input.ddl").first().selectOption("05");
  await page.locator(".input.ddl").nth(1).selectOption("25");
  await page.locator("input[class='input txt']").first().fill('552');
  await page.locator("input[class='input txt']").last().fill("Rahul");
  await page.locator("input.text-validated").nth(1).fill("testing.practice@tafmail.com")  
  // country selection
  await page.locator("[placeholder$='Country']").pressSequentially("can");  
  await page.locator("//*[text()=' Canada']").click();
  // placing order
  await page.locator("//*[contains(text(),'Place Order')]").click();  
  const SuccessMSG =  await page.locator(".hero-primary").textContent();
  await expect(SuccessMSG).toContain("Thankyou for the order");
  let OID = await page.locator("label.ng-star-inserted").textContent();
  OID = OID.slice(3,27);  

  await page.locator("//*[contains(text(),'History Page')]").click();  
  await page.locator("tr").nth(1).waitFor();
  await page.locator('//*[text()="'+OID+'"]/ancestor::tr/td[5]/button').click();  
  await page.locator("div.email-container").waitFor();
  const OID_visibility = await page.locator('//*[text()="'+OID+'"]').isVisible();  
  await expect(OID_visibility).toBeTruthy();
  // click view orders
  await page.locator("[routerlink*='myorders'].btn.-teal").click();
  await page.locator("tr").nth(1).waitFor();
  // delete placed order
  await page.locator('//*[text()="'+OID+'"]/ancestor::tr/td[6]/button').click();
  // verify delete  
  await page.waitForTimeout(2000);
  const OID_visibility_after_delete = await page.locator('//*[text()="'+OID+'"]').isVisible();  
  await expect(OID_visibility_after_delete).toBeFalsy();
  await page.pause();

});