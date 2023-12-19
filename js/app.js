
const i18n = new VueI18n({
    locale: localStorage.getItem('selectedLanguage') || 'fr',  
  });
  new Vue({
    el: '#app',
    i18n,
    data: {
      selectedLanguage: localStorage.getItem('selectedLanguage') || 'fr',
      languages: {
        fr: 'French',
        ar: 'Arabic'
      },
      allCards: []
    },
    methods: {
      async changeLanguage() {
        const response = await fetch(`lang/${this.selectedLanguage}.json`);
        const data = await response.json();
        this.$i18n.setLocaleMessage(this.selectedLanguage, data);
        localStorage.setItem('selectedLanguage', this.selectedLanguage);
        this.$i18n.locale = this.selectedLanguage;
        document.querySelector('.loading-screen').style.display = 'flex';
        setTimeout(() => {
          if (this.selectedLanguage === 'ar') {
            document.body.style.fontFamily = "'Cairo', sans-serif";
            document.querySelectorAll('.ar-rlt').forEach(ele => {
              ele.classList.add('arabic-rtl');
            });
          } else {
            document.body.style.fontFamily = "'Poppins', sans-serif";
            document.querySelectorAll('.ar-rlt').forEach(ele => {
              ele.classList.remove('arabic-rtl');
            });                
          }
          document.querySelector('.loading-screen').style.display = 'none';
        }, 2000);
      },
      async submitForm() {
        try {
          const response = await axios.post('http://127.0.0.1:5500/send-email', {
            name: this.name,
            email: this.email,
            subject: this.subject,
            message: this.message
          });
          console.log(response.data); // Handle response from backend
          // Reset form fields after successful submission
          this.name = '';
          this.email = '';
          this.subject = '';
          this.message = '';
        } catch (error) {
          console.error('Error sending email:', error);
          // Handle error or show a message to the user
        }
      },
      calculateYearsExperience() {
        let yearsExperienceDOM = document.querySelector('.yearsExperience');
        let dateNow = new Date();
        let nowYear = dateNow.getFullYear();
        let yearFounded = 1999;
        let yearsExperience = nowYear - yearFounded;
        if(yearsExperienceDOM) {
          yearsExperienceDOM.innerHTML = yearsExperience;
        }
      },
      handleScroll() {
        let navbar = document.querySelector('.navbar');
        let homeSection = document.getElementById('home');
        let homeHeight = homeSection.offsetHeight;
        if (window.scrollY > homeHeight) {
          navbar.classList.add('navbar-shadow');
        } else {
          navbar.classList.remove('navbar-shadow');
        }
      },
      cardEffect() {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            } else {
              entry.target.classList.remove("visible");
            }
          });
        }, { threshold: 0.5 });
  
        this.allCards.forEach(card => {
          observer.observe(card);
        });
      },
      initSwiper() {
        const swiper = new Swiper('.swiper', {
          direction: 'horizontal',
          loop: true,
          pagination: {
            el: '.swiper-pagination',
          },
          autoplay: {
            delay: 3000, 
          },
        });
      },
    },
    mounted() {
      this.changeLanguage(); 
      this.calculateYearsExperience(); 
      window.addEventListener('scroll', this.handleScroll);
      this.$nextTick(() => {
        this.allCards = Array.from(document.querySelectorAll(".effect-card"));
        this.cardEffect();
        this.initSwiper()
      });
      let scrollToTopBtn = document.getElementById("scrollToTopBtn");

      function updateButtonDisplay() {
        if (window.innerWidth <= 600) {
          scrollToTopBtn.style.display = "none";
        } else {
          if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
          } else {
            scrollToTopBtn.style.display = "none";
          }
        }
      }
      updateButtonDisplay();

      window.addEventListener("resize", updateButtonDisplay);

      window.addEventListener("scroll", function () {
        updateButtonDisplay();
      });

      scrollToTopBtn.addEventListener("click", function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  });
