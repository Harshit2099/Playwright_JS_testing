const {test, expect, request} = require("@playwright/test");


let context_with_storage_State;

test.beforeAll(async({browser})=>
{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client/");    
  await page.locator("#userEmail").fill("testing.practice@tafmail.com");
  await page.locator("#userPassword").fill("Welcome@123");    
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");
  await context.storageState({path: 'tests/example_two.json'});   // storing the session state in json
  context_with_storage_State = await browser.newContext({storageState:'tests/Test_two.json'});  // using the stored session state by giving the path of json
  await page.close();
});




test('client app normal flow',async ()=>
{  
  const page = await context_with_storage_State.newPage();
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