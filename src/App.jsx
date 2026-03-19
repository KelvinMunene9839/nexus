import { useEffect, useRef } from 'react'
import siteMarkup from './nexusMarkup.html?raw'
import './App.css'

const cleanedMarkup = siteMarkup.replace(/ onclick="closeDrawer\(\)"/g, '')

function App() {
  const pageRef = useRef(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) {
      return undefined
    }

    const reveals = root.querySelectorAll('.reveal, .timeline-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => {
              entry.target.classList.add('visible')
            }, index * 70)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    reveals.forEach((element) => observer.observe(element))

    const sections = root.querySelectorAll('[id]')
    const navLinks = root.querySelectorAll('.nav-links a')
    const updateActiveNav = () => {
      let current = ''

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 100) {
          current = section.id
        }
      })

      navLinks.forEach((anchor) => {
        anchor.classList.remove('active')
        if (anchor.getAttribute('href') === `#${current}`) {
          anchor.classList.add('active')
        }
      })
    }
    updateActiveNav()
    window.addEventListener('scroll', updateActiveNav, { passive: true })

    const hamburger = root.querySelector('#hamburger')
    const drawer = root.querySelector('#drawer')
    const overlay = root.querySelector('#overlay')
    const drawerCloseButton = root.querySelector('#drawerClose')
    const drawerLinks = root.querySelectorAll('.drawer-links a')

    const openDrawer = () => {
      drawer?.classList.add('open')
      overlay?.classList.add('open')
    }

    const closeDrawer = () => {
      drawer?.classList.remove('open')
      overlay?.classList.remove('open')
    }

    hamburger?.addEventListener('click', openDrawer)
    drawerCloseButton?.addEventListener('click', closeDrawer)
    overlay?.addEventListener('click', closeDrawer)
    drawerLinks.forEach((anchor) => anchor.addEventListener('click', closeDrawer))

    const form = root.querySelector('form')
    const formSubmit = root.querySelector('#formSubmit')
    const formNote = root.querySelector('#formNote')
    const defaultButtonLabel = formSubmit?.textContent ?? 'Send Message →'
    const defaultNote = formNote?.textContent ?? 'We typically reply within 2–3 days. 💛'
    let resetId = null

    const handleFormSubmit = (event) => {
      event.preventDefault()
      const inputs = form.querySelectorAll('input, textarea, select')
      const firstInvalid = Array.from(inputs).find(input => !input.value.trim())
      if (firstInvalid) {
        firstInvalid.focus()
        return
      }
      if (!formSubmit || !formNote) {
        return
      }

      formSubmit.textContent = '✓ Message Sent!'
      formSubmit.style.background = '#2a7a6f'
      formSubmit.style.color = '#fff'
      formNote.textContent = "Thanks! We'll be in touch soon. 🙌"

      if (resetId) {
        window.clearTimeout(resetId)
      }

      resetId = window.setTimeout(() => {
        formSubmit.textContent = defaultButtonLabel
        formSubmit.style.background = ''
        formSubmit.style.color = ''
        formNote.textContent = defaultNote
      }, 4000)
    }

    form?.addEventListener('submit', handleFormSubmit)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateActiveNav)
      hamburger?.removeEventListener('click', openDrawer)
      drawerCloseButton?.removeEventListener('click', closeDrawer)
      overlay?.removeEventListener('click', closeDrawer)
      drawerLinks.forEach((anchor) =>
        anchor.removeEventListener('click', closeDrawer),
      )
      formSubmit?.removeEventListener('click', handleFormSubmit)

      if (resetId) {
        window.clearTimeout(resetId)
      }
    }
  }, [])

  return <div ref={pageRef} dangerouslySetInnerHTML={{ __html: cleanedMarkup }} />
}

export default App
