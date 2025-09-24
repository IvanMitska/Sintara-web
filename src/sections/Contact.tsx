import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEnvelope, FaPhone, FaTelegram, FaMapMarkerAlt, FaInstagram, FaGithub, FaChevronDown, FaCheck } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = styled.section`
  padding: 8rem 0;
  background: var(--gradient-background), #0a0a0a;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const SectionTitle = styled.h2`
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
    width: 80px;
    height: 4px;
    background: var(--gradient-primary);
  }
`;

const SectionDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.1rem);
  max-width: 600px;
  margin: 0 auto;
  color: #a0a0a0;
  line-height: 1.6;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContactFormContainer = styled.div`
  background-color: #111;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #e0e0e0;
  font-weight: 600;
`;

const Input = styled.input`
  background-color: #0a0a0a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.8rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  transition: all var(--transition-normal);
  position: relative;
  
  &:focus {
    outline: none;
    border-color: #D76D77;
    box-shadow: 0 0 10px rgba(215, 109, 119, 0.2);
  }
  
  /* Создаем фоновый технологичный паттерн как в селекте */
  background-image: linear-gradient(90deg, 
    rgba(215, 109, 119, 0.03) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(215, 109, 119, 0.03) 50%, 
    rgba(215, 109, 119, 0.03) 75%, 
    transparent 75%);
  background-size: 10px 100%;
`;

const Textarea = styled.textarea`
  background-color: #0a0a0a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.8rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  transition: all var(--transition-normal);
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #D76D77;
    box-shadow: 0 0 10px rgba(215, 109, 119, 0.2);
  }
  
  /* Создаем фоновый технологичный паттерн как в селекте */
  background-image: linear-gradient(90deg, 
    rgba(215, 109, 119, 0.03) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(215, 109, 119, 0.03) 50%, 
    rgba(215, 109, 119, 0.03) 75%, 
    transparent 75%);
  background-size: 10px 100%;
`;

const Select = styled.select`
  background-color: #0a0a0a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.8rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #D76D77;
  }
  
  option {
    background-color: #0a0a0a;
  }
`;

const SubmitButton = styled.button`
  background: var(--gradient-button);
  color: white !important;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  span {
    color: white !important;

    svg {
      color: white !important;
    }
  }

  &:hover {
    color: white !important;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactCard = styled.div`
  background-color: #111;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  svg {
    color: #D76D77;
    font-size: 1.5rem;
    margin-top: 0.2rem;
  }
`;

const ContactItemContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactItemTitle = styled.h4`
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
`;

const ContactItemText = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  margin: 0;
  line-height: 1.6;
`;

const ContactLink = styled.a`
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #D76D77;
  }
`;

const SocialLinks = styled.div`
  margin-top: 2rem;
`;

const SocialTitle = styled.h4`
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 1rem 0;
`;

const SocialIconsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #D76D77;
    transform: translateY(-1px);
    filter: brightness(1.2);
  }
`;

// Новые компоненты для кастомного выпадающего списка
const CustomSelectContainer = styled.div`
  position: relative;
  width: 100%;
  user-select: none;
  margin-bottom: 0.5rem;
`;

const SelectTrigger = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background-color: #0a0a0a;
  border: 1px solid #333;
  border-radius: 5px;
  cursor: pointer;
  color: ${props => props.isOpen ? '#fff' : '#a0a0a0'};
  transition: all var(--transition-normal);
  
  /* Технологичная подсветка при фокусе */
  &:hover {
    border-color: #D76D77;
    background-color: #0f0f0f;
  }
  
  /* Стили активного состояния */
  ${props => props.isOpen && `
    border-color: #D76D77;
    box-shadow: 0 0 10px rgba(215, 109, 119, 0.2);
  `}
  
  /* Анимация иконки */
  svg {
    transition: transform var(--transition-normal), color var(--transition-normal);
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    color: ${props => props.isOpen ? '#D76D77' : '#555'};
    margin-left: 8px;
    font-size: 0.8rem;
  }
  
  /* Технологичный эффект заднего фона */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(90deg, 
        rgba(215, 109, 119, 0.03) 25%, 
        transparent 25%, 
        transparent 50%, 
        rgba(215, 109, 119, 0.03) 50%, 
        rgba(215, 109, 119, 0.03) 75%, 
        transparent 75%);
    background-size: 10px 100%;
    opacity: 0.5;
    pointer-events: none;
    z-index: -1;
    border-radius: 4px;
  }
  
  /* Эффект свечения при наведении */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--gradient-primary);
    border-radius: 7px;
    z-index: -2;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &:hover::after {
    opacity: 0.2;
  }
`;

const SelectValue = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SelectDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 5px;
  border: 1px solid #333;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  z-index: 100;
  max-height: ${props => props.isOpen ? '200px' : '0'};
  opacity: ${props => props.isOpen ? 1 : 0};
  overflow: hidden;
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: max-height var(--transition-normal), 
              opacity var(--transition-normal),
              visibility var(--transition-normal);
  
  /* Технологичная подсветка границы */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: inherit;
    box-shadow: 0 0 0 1px rgba(215, 109, 119, 0.2);
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity var(--transition-normal);
  }
  
  /* Сканирующая линия */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #D76D77, transparent);
    transform: translateY(-10px);
    opacity: 0;
    
    ${props => props.isOpen && `
      animation: scanLine 1.5s ease-in-out infinite;
      opacity: 1;
    `}
  }
  
  @keyframes scanLine {
    0% { transform: translateY(-10px); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(210px); opacity: 0; }
  }
  
  /* Технологичный фоновый узор */
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(215, 109, 119, 0.03) 0%, transparent 30%),
    linear-gradient(rgba(215, 109, 119, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(215, 109, 119, 0.02) 1px, transparent 1px);
  background-size: 100% 100%, 20px 20px, 20px 20px;
  background-position: 0 0, center center, center center;
`;

const SelectOption = styled.div<{ $isActive: boolean }>`
  padding: 0.8rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$isActive ? '#fff' : '#a0a0a0'};
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: #1a1a1a;
    color: #fff;
  }
  
  /* Эффект при наведении */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: linear-gradient(to bottom, #D76D77, #FFAF7B);
    transform: scaleY(0);
    transition: transform 0.25s ease;
    transform-origin: top;
  }
  
  &:hover::before {
    transform: scaleY(1);
  }
  
  /* Стили для активного элемента */
  ${props => props.$isActive && `
    background: linear-gradient(90deg, rgba(215, 109, 119, 0.1), transparent);
    border-left: 3px solid #D76D77;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(215, 109, 119, 0.05), transparent);
      pointer-events: none;
    }
  `}
`;

interface CustomSelectProps {
  options: { value: string; label: string }[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  id: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  value,
  onChange,
  name,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    
    // Анимация для выбранной опции
    if (triggerRef.current) {
      // Пульсирующая анимация
      gsap.timeline()
        .to(triggerRef.current, { 
          borderColor: '#D76D77', 
          boxShadow: '0 0 10px rgba(215, 109, 119, 0.4)', 
          duration: 0.2 
        })
        .to(triggerRef.current, { 
          boxShadow: '0 0 15px rgba(215, 109, 119, 0.6)', 
          scale: 1.01, 
          duration: 0.2 
        })
        .to(triggerRef.current, { 
          boxShadow: '0 0 5px rgba(215, 109, 119, 0.2)', 
          scale: 1, 
          duration: 0.3 
        })
        .to(triggerRef.current, { 
          borderColor: '#333', 
          boxShadow: 'none', 
          duration: 0.3, 
          delay: 0.2 
        });
    }
  };

  // Анимируем открытие выпадающего списка
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const options = selectRef.current.querySelectorAll('[role="option"]');
      gsap.fromTo(
        options,
        { 
          opacity: 0, 
          y: -10 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.3, 
          stagger: 0.05,
          ease: "power2.out" 
        }
      );
    }
  }, [isOpen]);

  return (
    <CustomSelectContainer ref={selectRef}>
      <SelectTrigger 
        ref={triggerRef}
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <SelectValue>
          {selectedOption ? selectedOption.label : placeholder}
        </SelectValue>
        <FaChevronDown />
      </SelectTrigger>
      <SelectDropdown isOpen={isOpen}>
        {options.map((option) => (
          <SelectOption
            key={option.value}
            $isActive={option.value === value}
            onClick={() => handleOptionClick(option.value)}
            role="option"
            aria-selected={option.value === value}
          >
            {option.label}
            {option.value === value && <FaCheck color="#D76D77" />}
          </SelectOption>
        ))}
      </SelectDropdown>
      {/* Скрытый оригинальный select для корректной работы с формой */}
      <input type="hidden" name={name} id={id} value={value} />
    </CustomSelectContainer>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: ''
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const form = formRef.current;
    const info = infoRef.current;

    if (section && header && form && info) {
      // Анимация заголовка
      gsap.fromTo(
        header,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация формы
      gsap.fromTo(
        form,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: form,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация контактной информации
      gsap.fromTo(
        info,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: info,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Form data:', formData);
    // Сбросить форму после отправки
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      budget: '',
      message: ''
    });
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
  };

  // Опции для выпадающих списков
  const serviceOptions = [
    { value: '', label: 'Выберите услугу' },
    { value: 'website', label: 'Разработка сайта' },
    { value: 'bot', label: 'Разработка Telegram-бота' },
    { value: 'both', label: 'Сайт и Telegram-бот' },
    { value: 'other', label: 'Другое' }
  ];

  const budgetOptions = [
    { value: '', label: 'Выберите бюджет' },
    { value: '30000-50000', label: '30 000 - 50 000 ₽' },
    { value: '50000-100000', label: '50 000 - 100 000 ₽' },
    { value: '100000-200000', label: '100 000 - 200 000 ₽' },
    { value: '200000+', label: 'более 200 000 ₽' }
  ];

  return (
    <ContactSection id="contact" ref={sectionRef}>
      <Container>
        <SectionHeader ref={headerRef}>
          <SectionTitle>Свяжитесь с нами</SectionTitle>
          <SectionDescription>
            Оставьте заявку, и мы свяжемся с вами для обсуждения деталей вашего проекта
          </SectionDescription>
        </SectionHeader>

        <ContactContent>
          <ContactFormContainer ref={formRef}>
            <ContactForm onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">Имя</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="service">Услуга</Label>
                  <CustomSelect
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={(value) => handleSelectChange('service', value)}
                    options={serviceOptions}
                    placeholder="Выберите услугу"
                  />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label htmlFor="budget">Бюджет</Label>
                <CustomSelect
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={(value) => handleSelectChange('budget', value)}
                  options={budgetOptions}
                  placeholder="Выберите бюджет"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="message">Сообщение</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required
                />
              </FormGroup>
              <SubmitButton type="submit">Отправить заявку</SubmitButton>
            </ContactForm>
          </ContactFormContainer>

          <ContactInfo ref={infoRef}>
            <ContactCard>
              <ContactList>
                <ContactItem>
                  <FaEnvelope />
                  <ContactItemContent>
                    <ContactItemTitle>Email</ContactItemTitle>
                    <ContactItemText>
                      <ContactLink href="mailto:mitska91@gmail.com">mitska91@gmail.com</ContactLink>
                    </ContactItemText>
                  </ContactItemContent>
                </ContactItem>
                <ContactItem>
                  <FaPhone />
                  <ContactItemContent>
                    <ContactItemTitle>Телефон</ContactItemTitle>
                    <ContactItemText>
                      <ContactLink href="tel:+79856814733">+7 (985) 681-47-33</ContactLink>
                    </ContactItemText>
                  </ContactItemContent>
                </ContactItem>
                <ContactItem>
                  <FaTelegram />
                  <ContactItemContent>
                    <ContactItemTitle>Telegram</ContactItemTitle>
                    <ContactItemText>
                      <ContactLink href="https://t.me/IvanMitska" target="_blank" rel="noopener noreferrer">
                        @IvanMitska
                      </ContactLink>
                    </ContactItemText>
                  </ContactItemContent>
                </ContactItem>
                <ContactItem>
                  <FaMapMarkerAlt />
                  <ContactItemContent>
                    <ContactItemTitle>Адрес</ContactItemTitle>
                    <ContactItemText>
                      Phuket
                    </ContactItemText>
                  </ContactItemContent>
                </ContactItem>
              </ContactList>

              <SocialLinks>
                <SocialTitle>Мы в соцсетях</SocialTitle>
                <SocialIconsContainer>
                  <SocialIconLink href="https://t.me/username" target="_blank" rel="noopener noreferrer">
                    <FaTelegram />
                  </SocialIconLink>
                  <SocialIconLink href="https://instagram.com/username" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </SocialIconLink>
                  <SocialIconLink href="https://github.com/username" target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </SocialIconLink>
                </SocialIconsContainer>
              </SocialLinks>
            </ContactCard>
          </ContactInfo>
        </ContactContent>
      </Container>
    </ContactSection>
  );
};

export default Contact;
