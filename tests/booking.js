import { chromium } from 'k6/x/browser'
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js'

import { AdminPanel } from '../pages/admin-panel.js'
import { Homepage } from '../pages/homepage.js'
import { bookingData } from '../data/booking-data.js'
import { testSetup } from './setup.js'

export function setup() {
  testSetup()
}
// describe block has issues with async operations https://github.com/mochajs/mocha/issues/2975
// getting this error since it's trying to execute the second describe block already        
// ✗ Exception raised "GoError: clicking on "//a[text()=\"Admin panel\"]": getting new document handle: getting document element handle: 
// execution context changed; most likely because of a navigation"
export default async function () {
  const browser = chromium.launch({ headless: false })
  const context = browser.newContext()
  const page = context.newPage()

  const { name, email } = bookingData

  describe('Given a user submits a booking query', async () => {
    const homepage = new Homepage(page)
    await homepage.goto()
    homepage.submitForm()

    expect(homepage.getVerificationMessage()).to.contain(name)
  })

  describe('When an admin logs in to the admin panel and view the messages', async () => {
    const adminPanel = new AdminPanel(page)
    await adminPanel.login()

    adminPanel.openMessage()
    const actualMessage = adminPanel.getMessage().innerText()

    expect(actualMessage).to.contain(name)
    expect(actualMessage).to.contain(email)
  })

  page.close()
  browser.close()
}
