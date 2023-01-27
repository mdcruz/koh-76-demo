import { chromium } from 'k6/x/browser'
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js'
import http from 'k6/http'

import { Homepage } from '../pages/homepage.js'
import { AdminPanel } from '../pages/admin-panel.js'
import { bookingData } from '../data/booking-data.js'
import { testSetup } from './setup.js'

const { name } = bookingData

export const options = {
  scenarios: {
    booking: {
      executor: 'shared-iterations',
      exec: 'booking',
      vus: 1,
      iterations: 1
    },
    messages: {
      executor: 'shared-iterations',
      exec: 'messages',
      vus: 1,
      iterations: 1,
    },
    login: {
      executor: 'shared-iterations',
      exec: 'login',
      vus: 1,
      iterations: 1
    }
  },
}

export function setup() {
  testSetup()
}

export async function booking() {
  const browser = chromium.launch({ 
    headless: false,
    slowMo: '500ms'
  })
  const context = browser.newContext()
  const page = context.newPage()

  try {
    const homepage = new Homepage(page)
    await homepage.goto()
    homepage.submitForm()

    expect(homepage.getVerificationMessage()).to.contain(name)
  } finally {
    page.close()
    browser.close()
  }
}

export async function login() {
  const browser = chromium.launch({ 
    headless: false,
    slowMo: '500ms'
  })
  const context = browser.newContext()
  const page = context.newPage()

  try {
    const adminPanel = new AdminPanel(page)
    await adminPanel.login()
    
    expect(adminPanel.getLogoutButton()).to.equal('Logout')
  } finally {
    page.close()
    browser.close()
  }
}

export function messages() {
  const res = http.post('https://automationintesting.online/message/', JSON.stringify(bookingData), {
    headers: { 'Content-Type': 'application/json' },
  });

  expect(res.status).to.equal(201)
  expect(JSON.parse(res.body).name).to.equal(name)
}