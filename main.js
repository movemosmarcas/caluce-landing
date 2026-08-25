document.addEventListener('DOMContentLoaded', () => {
    const forms = [document.getElementById('contact-form'), document.getElementById('popup-contact-form')];

    forms.forEach(form => {
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const rawFormData = new FormData(form);
                const servicios = rawFormData.getAll('servicio[]');
                
                if (servicios.length === 0) {
                    alert('Por favor, selecciona al menos un servicio de interés.');
                    return;
                }
                
                const btn = form.querySelector('.submit-btn');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<span>ENVIANDO...</span>';
                btn.disabled = true;
                
                const formData = new FormData();
                
                formData.append('nombre', rawFormData.get('nombre') || '');
                formData.append('celular', rawFormData.get('celular') || '');
                formData.append('email', rawFormData.get('email') || '');
                formData.append('para_quien', rawFormData.get('para_quien') || '');
                formData.append('sede', rawFormData.get('sede') || '');
                
                // Unir múltiples servicios con coma si eligen varios
                formData.append('servicio', servicios.join(', '));
                
                // Mapear 'politica' a 'datos' como espera el Apps Script
                const politica = rawFormData.get('politica') ? 'Sí' : 'No';
                formData.append('datos', politica);
                
                // --- NUEVO: CAPTURAR UTMS Y DATOS DE ORIGEN ---
                const urlParams = new URLSearchParams(window.location.search);
                formData.append('fuente_lead', 'Landing Page Caluce');
                formData.append('utm_source', urlParams.get('utm_source') || '');
                formData.append('utm_medium', urlParams.get('utm_medium') || '');
                formData.append('utm_campaign', urlParams.get('utm_campaign') || '');
                formData.append('utm_content', urlParams.get('utm_content') || '');
                formData.append('utm_term', urlParams.get('utm_term') || '');
                formData.append('url_origen', window.location.href);
                
                const params = new URLSearchParams();
                for (const pair of formData.entries()) {
                    params.append(pair[0], pair[1]);
                }
                
                fetch('https://script.google.com/macros/s/AKfycbyLURkc8z_KQ6VQrvx0bXarpJi5FAUWD-cElD9gVxXQ-abSU8F6sWpbtOuExsmOUBULjg/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params
                })
                .then(response => {
                    btn.innerHTML = '<span>¡ENVIADO CORRECTAMENTE!</span>';
                    btn.style.backgroundColor = '#2ecc71';
                    
                    setTimeout(() => {
                        window.location.href = 'gracias.html';
                    }, 800);
                })
                .catch(error => {
                    console.error('Error al enviar el formulario:', error);
                    btn.innerHTML = '<span>ERROR, INTENTA DE NUEVO</span>';
                    btn.style.backgroundColor = '#e74c3c';
                    btn.disabled = false;
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                    }, 3000);
                });
            });
        }
    });

    // FAB visibility on scroll
    const fabContainer = document.querySelector('.fab-container');
    if (fabContainer) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.7) {
                fabContainer.classList.add('visible');
            } else {
                fabContainer.classList.remove('visible');
            }
        });
    }

    // Add subtle entrance animations to form elements sequentially
    const formGroups = document.querySelectorAll('.form-group, .form-checkbox, .submit-btn');
    formGroups.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'all 0.4s ease-out';
        el.style.transitionDelay = `${0.2 + (index * 0.05)}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});

// Form Modal logic
window.openFormModal = function(sedeValue = null) {
    const formModal = document.getElementById('form-modal');
    if(formModal) {
        formModal.style.display = "flex";
        setTimeout(() => formModal.classList.add('show'), 10);
        
        if (sedeValue) {
            const sedeSelect = document.getElementById('sede-popup');
            if (sedeSelect) {
                sedeSelect.value = sedeValue;
                sedeSelect.style.transition = 'all 0.3s ease';
                sedeSelect.style.boxShadow = '0 0 0 3px var(--secondary-color)';
                setTimeout(() => sedeSelect.style.boxShadow = 'none', 2500);
            }
        }
    }
};



// FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Modal Logic
    const closeBtns = document.querySelectorAll('.close-modal');
    closeBtns.forEach(btn => {
        btn.onclick = function() {
            const modal = btn.closest('.modal');
            if(modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = "none";
                    if (modal.id === 'video-modal') {
                        document.getElementById('youtube-iframe').src = "";
                    }
                }, 300);
            }
        }
    });

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
            setTimeout(() => {
                event.target.style.display = "none";
                if (event.target.id === 'video-modal') {
                    document.getElementById('youtube-iframe').src = "";
                }
            }, 300);
        }
    }
    
    // Video Modal Open Logic
    window.openVideoModal = function(youtubeId) {
        if (!youtubeId) {
            alert("Video próximamente disponible");
            return;
        }
        const videoModal = document.getElementById('video-modal');
        const iframe = document.getElementById('youtube-iframe');
        
        if(videoModal && iframe) {
            iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
            videoModal.style.display = "flex";
            setTimeout(() => videoModal.classList.add('show'), 10);
        }
    };

    // Hero Slideshow
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides.forEach(slide => slide.classList.remove('prev'));
            
            slides[currentSlide].classList.remove('active');
            slides[currentSlide].classList.add('prev');
            
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }
});
