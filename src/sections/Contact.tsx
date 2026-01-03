import React, { useState, useRef, useEffect, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaTelegram, FaMapMarkerAlt, FaArrowRight, FaPaperPlane, FaChevronDown, FaCheck, FaGlobe, FaRobot, FaMobileAlt, FaCode, FaCog } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ContactSection = styled.section`
  padding: 100px 0;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled(motion.h2)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 20px;
`;

const Subtitle = styled(motion.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4), transparent);
  }

  @media (max-width: 768px) {
    padding: 28px;
  }
`;

const FormTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 18px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: #ffffff;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(124, 58, 237, 0.5);
    background: rgba(124, 58, 237, 0.05);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
`;

const Textarea = styled.textarea`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 18px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: #ffffff;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(124, 58, 237, 0.5);
    background: rgba(124, 58, 237, 0.05);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
`;

// Custom Multi-Select Components
const MultiSelectContainer = styled.div`
  position: relative;
`;

const MultiSelectTrigger = styled.button<{ $isOpen: boolean; $hasSelection: boolean }>`
  width: 100%;
  background: ${props => props.$isOpen ? 'rgba(124, 58, 237, 0.05)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$isOpen ? 'rgba(124, 58, 237, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 14px 18px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: ${props => props.$hasSelection ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'};
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  ${props => props.$isOpen && `
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  `}

  &:hover {
    border-color: rgba(124, 58, 237, 0.4);
    background: rgba(124, 58, 237, 0.05);
  }
`;

const TriggerText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TriggerIcon = styled.div<{ $isOpen: boolean }>`
  color: #a78bfa;
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  display: flex;
  align-items: center;

  svg {
    font-size: 14px;
  }
`;

const SelectedCount = styled.span`
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  min-width: 24px;
  text-align: center;
`;

const MultiSelectDropdown = styled(motion.div)<{ $top: number; $left: number; $width: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${props => props.$width}px;
  background: linear-gradient(135deg, rgba(25, 12, 45, 0.98) 0%, rgba(12, 6, 25, 0.99) 100%);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 16px;
  padding: 8px;
  z-index: 1000;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 60px rgba(124, 58, 237, 0.12);
  backdrop-filter: blur(20px);
`;

const DropdownHeader = styled.div`
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 6px;
`;

const DropdownTitle = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const OptionItem = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: ${props => props.$isSelected
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)'
    : 'transparent'};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${props => props.$isSelected
      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(124, 58, 237, 0.15) 100%)'
      : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const OptionCheckbox = styled.div<{ $isSelected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid ${props => props.$isSelected ? '#7c3aed' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.$isSelected ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    font-size: 10px;
    color: white;
    opacity: ${props => props.$isSelected ? 1 : 0};
    transform: ${props => props.$isSelected ? 'scale(1)' : 'scale(0.5)'};
    transition: all 0.2s ease;
  }
`;

const OptionIcon = styled.div<{ $isSelected: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: ${props => props.$isSelected
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.15) 100%)'
    : 'rgba(255, 255, 255, 0.05)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  svg {
    font-size: 15px;
    color: ${props => props.$isSelected ? '#a78bfa' : 'rgba(255, 255, 255, 0.4)'};
    transition: color 0.2s ease;
  }
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionLabel = styled.div<{ $isSelected: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.$isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: 1px;
  transition: color 0.2s ease;
`;

const OptionDescription = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 16px 32px;
  border: none;
  border-radius: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
  margin-top: 8px;

  svg {
    font-size: 16px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;

    svg {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const InfoCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContactMethodsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const ContactMethod = styled(motion.a)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.6) 0%, rgba(10, 5, 20, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(124, 58, 237, 0.3);
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(20, 10, 40, 0.8) 100%);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  }
`;

const MethodIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 24px;
    color: #a78bfa;
  }
`;

const MethodContent = styled.div`
  flex: 1;
`;

const MethodLabel = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
`;

const MethodValue = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #ffffff;
`;

const MethodArrow = styled.div`
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  ${ContactMethod}:hover & {
    color: #a78bfa;
    transform: translateX(4px);
  }
`;

const QuickContactCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.9) 100%);
  border: 1px solid rgba(124, 58, 237, 0.25);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
`;

const QuickContactTitle = styled.h4`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px;
`;

const QuickContactText = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 24px;
  line-height: 1.6;
`;

const TelegramButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

  svg {
    font-size: 18px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
  }
`;

const LocationCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.6) 0%, rgba(10, 5, 20, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LocationIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px;
    color: #a78bfa;
  }
`;

const LocationText = styled.div``;

const LocationLabel = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
`;

const LocationValue = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
`;

// Service options with icons
const serviceOptionsData = {
  en: [
    { value: 'website', label: 'Website Development', description: 'Landing pages, corporate sites', icon: FaGlobe },
    { value: 'webapp', label: 'Web Application', description: 'Complex SaaS, dashboards', icon: FaCode },
    { value: 'bot', label: 'Telegram Bot', description: 'Automation, customer service', icon: FaRobot },
    { value: 'mobile', label: 'Mobile App', description: 'iOS & Android applications', icon: FaMobileAlt },
    { value: 'other', label: 'Other', description: 'Custom development needs', icon: FaCog },
  ],
  ru: [
    { value: 'website', label: 'Разработка сайта', description: 'Лендинги, корпоративные сайты', icon: FaGlobe },
    { value: 'webapp', label: 'Веб-приложение', description: 'Сложные SaaS, дашборды', icon: FaCode },
    { value: 'bot', label: 'Telegram-бот', description: 'Автоматизация, поддержка клиентов', icon: FaRobot },
    { value: 'mobile', label: 'Мобильное приложение', description: 'Приложения для iOS и Android', icon: FaMobileAlt },
    { value: 'other', label: 'Другое', description: 'Индивидуальная разработка', icon: FaCog },
  ]
};

const Contact: React.FC = memo(() => {
  const { language } = useLanguage();
  const serviceOptions = serviceOptionsData[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    services: [] as string[],
    message: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Вычисляем позицию dropdown при открытии
  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 380; // примерная высота dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Открываем сверху если снизу мало места
      const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setDropdownPosition({
        top: openAbove ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
    setIsDropdownOpen(true);
  };

  // Закрытие по клику вне dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        const dropdown = document.getElementById('services-dropdown');
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter(s => s !== value)
        : [...prev.services, value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setFormData({ name: '', email: '', services: [], message: '' });
    setIsDropdownOpen(false);
    alert(language === 'en' ? 'Thank you! We\'ll get back to you soon.' : 'Спасибо! Мы свяжемся с вами в ближайшее время.');
  };

  const getSelectedText = () => {
    if (formData.services.length === 0) return language === 'en' ? 'Select services' : 'Выберите услуги';
    if (formData.services.length === 1) {
      const service = serviceOptions.find(s => s.value === formData.services[0]);
      return service?.label || (language === 'en' ? 'Select services' : 'Выберите услуги');
    }
    return language === 'en' ? `${formData.services.length} services selected` : `Выбрано услуг: ${formData.services.length}`;
  };

  return (
    <ContactSection id="contact">
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {language === 'en' ? 'Get in touch' : 'Свяжитесь с нами'}
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {language === 'en'
              ? "Let's discuss your project and bring your ideas to life"
              : 'Давайте обсудим ваш проект и воплотим ваши идеи в жизнь'}
          </Subtitle>
        </SectionHeader>

        <ContactGrid>
          <FormCard
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FormTitle>{language === 'en' ? 'Send us a message' : 'Отправьте нам сообщение'}</FormTitle>
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">{language === 'en' ? 'Name' : 'Имя'}</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={language === 'en' ? 'Your name' : 'Ваше имя'}
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
                    placeholder={language === 'en' ? 'your@email.com' : 'ваш@email.com'}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>{language === 'en' ? 'Services' : 'Услуги'}</Label>
                <MultiSelectContainer>
                  <MultiSelectTrigger
                    ref={triggerRef}
                    type="button"
                    $isOpen={isDropdownOpen}
                    $hasSelection={formData.services.length > 0}
                    onClick={() => isDropdownOpen ? setIsDropdownOpen(false) : openDropdown()}
                  >
                    <TriggerText>{getSelectedText()}</TriggerText>
                    {formData.services.length > 1 && (
                      <SelectedCount>{formData.services.length}</SelectedCount>
                    )}
                    <TriggerIcon $isOpen={isDropdownOpen}>
                      <FaChevronDown />
                    </TriggerIcon>
                  </MultiSelectTrigger>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <MultiSelectDropdown
                        id="services-dropdown"
                        $top={dropdownPosition.top}
                        $left={dropdownPosition.left}
                        $width={dropdownPosition.width}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DropdownHeader>
                          <DropdownTitle>{language === 'en' ? 'Select services' : 'Выберите услуги'}</DropdownTitle>
                        </DropdownHeader>
                        <OptionsList>
                          {serviceOptions.map((option) => {
                            const isSelected = formData.services.includes(option.value);
                            const IconComponent = option.icon;
                            return (
                              <OptionItem
                                key={option.value}
                                type="button"
                                $isSelected={isSelected}
                                onClick={() => toggleService(option.value)}
                              >
                                <OptionCheckbox $isSelected={isSelected}>
                                  <FaCheck />
                                </OptionCheckbox>
                                <OptionIcon $isSelected={isSelected}>
                                  <IconComponent />
                                </OptionIcon>
                                <OptionContent>
                                  <OptionLabel $isSelected={isSelected}>{option.label}</OptionLabel>
                                  <OptionDescription>{option.description}</OptionDescription>
                                </OptionContent>
                              </OptionItem>
                            );
                          })}
                        </OptionsList>
                      </MultiSelectDropdown>
                    )}
                  </AnimatePresence>
                </MultiSelectContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="message">{language === 'en' ? 'Message' : 'Сообщение'}</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={language === 'en' ? 'Tell us about your project...' : 'Расскажите о вашем проекте...'}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <SubmitButton type="submit">
                {language === 'en' ? 'Send message' : 'Отправить'} <FaPaperPlane />
              </SubmitButton>
            </Form>
          </FormCard>

          <InfoCard
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ContactMethodsGrid>
              <ContactMethod href="mailto:sintaradev@gmail.com">
                <MethodIcon>
                  <FaEnvelope />
                </MethodIcon>
                <MethodContent>
                  <MethodLabel>{language === 'en' ? 'Email us' : 'Напишите нам'}</MethodLabel>
                  <MethodValue>sintaradev@gmail.com</MethodValue>
                </MethodContent>
                <MethodArrow>
                  <FaArrowRight />
                </MethodArrow>
              </ContactMethod>

              <ContactMethod href="https://t.me/IvanMitska" target="_blank" rel="noopener noreferrer">
                <MethodIcon>
                  <FaTelegram />
                </MethodIcon>
                <MethodContent>
                  <MethodLabel>Telegram</MethodLabel>
                  <MethodValue>@IvanMitska</MethodValue>
                </MethodContent>
                <MethodArrow>
                  <FaArrowRight />
                </MethodArrow>
              </ContactMethod>
            </ContactMethodsGrid>

            <QuickContactCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <QuickContactTitle>{language === 'en' ? 'Prefer a quick chat?' : 'Хотите быстро связаться?'}</QuickContactTitle>
              <QuickContactText>
                {language === 'en'
                  ? "Get instant response on Telegram. We're usually online during business hours."
                  : 'Получите мгновенный ответ в Telegram. Мы обычно онлайн в рабочее время.'}
              </QuickContactText>
              <TelegramButton href="https://t.me/IvanMitska" target="_blank" rel="noopener noreferrer">
                <FaTelegram /> {language === 'en' ? 'Message on Telegram' : 'Написать в Telegram'}
              </TelegramButton>
            </QuickContactCard>

            <LocationCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <LocationIcon>
                <FaMapMarkerAlt />
              </LocationIcon>
              <LocationText>
                <LocationLabel>{language === 'en' ? 'Based in' : 'Мы находимся'}</LocationLabel>
                <LocationValue>{language === 'en' ? 'Phuket, Thailand' : 'Пхукет, Таиланд'}</LocationValue>
              </LocationText>
            </LocationCard>
          </InfoCard>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
});

Contact.displayName = 'Contact';

export default Contact;
