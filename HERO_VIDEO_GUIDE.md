# Hero Video — гайд по созданию и подключению

Подробная инструкция: где взять или как сгенерировать видео-лоп для hero-секции главной страницы, как его оптимизировать и положить в проект.

> **Контекст:** в `src/sections/home/Hero.tsx` уже подключён `<video>`-фон, который ищет файлы по путям ниже. Как только ты положишь их в `public/home/`, всё заработает без правок кода.

---

## TL;DR — что нужно положить и куда

```
public/home/
├── hero-loop.mp4    ← обязательно (H.264, ≤ 4 МБ, 6–10 сек, seamless loop)
├── hero-loop.webm   ← опционально (VP9, ~30% меньше — Chrome предпочтёт его)
└── hero-poster.jpg  ← обязательно (первый кадр, ~80–150 КБ — показывается мгновенно)
```

Имена менять **нельзя** — они захардкожены в `Hero.tsx`. Если хочешь другие — скажи, поправлю.

---

## Целевые тех-параметры (контрольный лист)

| Параметр | Значение | Почему |
|---|---|---|
| Разрешение | **1920×1080** (мин) / 2560×1440 (идеал) | Меньше — мыло на ретине; больше — лишний вес |
| Соотношение сторон | 16:9 | Видео обрезается `object-fit: cover` под любой viewport |
| Длительность | **6–10 сек** | Меньше — заметная цикличность; больше — лишний вес |
| Цикличность | **Бесшовный loop** | Иначе будет видимый «дёрг» каждый цикл |
| Кодек MP4 | H.264 (libx264), CRF 22–26 | Universal compat; Safari только это и любит |
| Кодек WebM | VP9 (libvpx-vp9), CRF 30–34 | Chrome/Firefox — меньше файл при том же качестве |
| Битрейт | 2–5 Мбит/с | Выше — заметная задержка перед первым кадром |
| Файл MP4 | **≤ 4 МБ** | LCP-критерий: больше = «медленный» сайт по Lighthouse |
| Звук | **Удалить полностью** (`-an`) | Autoplay без muted блокируется браузерами + 100–500 КБ лишнего веса |
| Цветовое пр-во | sRGB | Rec.2020/HDR — выглядит тускло на не-OLED |
| `+faststart` | **Обязательно** для MP4 | Без него браузер не начнёт играть до полной загрузки |
| Постер | JPG (не PNG!), q=75, ≤ 150 КБ | PNG раздует файл в 5× для фотореалистичного кадра |

---

## Путь 1 — Бесплатный сток (5 минут работы)

Самый быстрый путь. Качество — отличное, лицензия чистая.

### Где искать (по убыванию полезности)

| Сайт | URL | Что искать | Лицензия |
|---|---|---|---|
| **Pexels Videos** | https://www.pexels.com/videos/ | `purple crystal`, `amethyst`, `cosmic dust`, `nebula loop`, `glowing rock`, `bokeh purple`, `space particles` | Pexels License (free commercial, no attribution) |
| **Coverr** | https://coverr.co/ | категории `Nature` + `Abstract`, теги `cosmic`, `purple`, `crystal` | CC0 (полностью свободно) |
| **Mixkit** | https://mixkit.co/free-stock-video/ | `crystal rotating`, `space particles`, `nebula`, `cosmic` | Mixkit License (free commercial) |
| **Videvo** | https://www.videvo.net/ | `amethyst spinning`, `crystal cluster` (фильтр Free → CC) | Часто CC, нужна регистрация |
| **Pond5 Public Domain** | https://www.pond5.com/free | `crystal background loop` | CC0 |

### Что должно сойтись в идеальном клипе

✅ **Хочется:**
- Тёмный/чёрный фон (НЕ студийный белый)
- Один фокусный объект (кристалл/геода/шейп) по центру или в правой части кадра
- Дрейфующие частицы/пыль/bokeh на дальнем плане
- Медленное вращение или дыхание объекта
- Холодная палитра (фиолетовый/индиго/синий) — но любой цвет можно перекрасить через CSS hue-rotate
- Длина 6–10 сек, петля без шва

❌ **Избегать:**
- Резких склеек/монтажа (это не клип, это фон)
- Логотипов/водяных знаков
- Кадрирования с текстом или людьми
- Резкого камера-движения (panning/dolly) — потянет внимание от тайтла
- Слишком яркий центр — съест центральный headline

### Если цвет не точно фиолетовый

Не страшно. В `Hero.tsx` можно добавить CSS-фильтр на `<VideoBg>`:

```css
filter: hue-rotate(15deg) saturate(1.15) brightness(0.95);
```

- `hue-rotate(+25deg)` крутит синий → фиолетовый
- `hue-rotate(-30deg)` крутит магента → фиолетовый
- `saturate(0.6)` приглушает, если цвет слишком ядрёный

Скажи какое видео взял — подберу значения.

---

## Путь 2 — AI-генерация видео (15–30 минут)

Если стоковое не нашлось — генерируем под себя.

### Сервисы (по убыванию качества для нашего кейса)

| Сервис | URL | Цена | Длина | Особенности |
|---|---|---|---|---|
| **Runway Gen-3 Alpha Turbo** | https://runwayml.com/ | $12/мес (125 кредитов) | 5–10 сек | Лучшее качество для абстрактного 3D-look |
| **Kling 1.6** | https://klingai.com/ | Free (лимит) / $6.99/мес | 5–10 сек | Очень фотореалистичный, кристаллы получаются «живые» |
| **Google Veo 2** | https://aistudio.google.com/ | Free (с лимитом) | 8 сек | Самый кинематографичный; доступ ограничен |
| **Luma Dream Machine** | https://lumalabs.ai/dream-machine | Free 30/мес | 5 сек | Простой UI, хорош для image→video из готовой картинки |
| **Pika 2.0** | https://pika.art/ | $8/мес | 5 сек | Окей для bokeh/частиц, кристаллы слабее |

### Готовые промпты (копируй как есть)

#### Промпт №1 — кристалл-аметист в космосе (для Runway/Kling/Veo)

```
A single large amethyst crystal cluster rotating very slowly in deep space,
deep purple and violet hues, soft volumetric light from the upper-left,
floating bioluminescent dust particles with shallow depth of field bokeh,
cinematic, octane render, 8K, hyperreal materials, slow seamless loop,
dark cosmic background, no camera movement, centered composition
```

**Negative (если поддерживается):** `text, watermark, logo, people, fast motion, white background, glitch`

#### Промпт №2 — макро-геода (более плотная фактура)

```
Macro cinematic shot of a glowing purple amethyst geode floating in dark
void, gentle slow rotation, surrounded by drifting glitter and out-of-focus
violet bokeh particles, studio lighting, photorealistic, seamless looping
animation, ProRes quality, no text, no logos, deep blacks, brand violet
(#7C3AED)
```

#### Промпт №3 — low-poly стилизованный (если хочется графичнее, ближе к Lusion)

```
Slowly rotating low-poly faceted crystal made of translucent purple glass,
caustics, refraction, dispersion, suspended in dark void with soft violet
particles drifting past, dark navy background (#08060f), 3D render,
smooth seamless loop, no camera movement, no text, centered subject
```

#### Промпт №4 — абстрактная плазма/нефть (если хочется не кристалл, а живую субстанцию)

```
Abstract slow-flowing iridescent liquid in zero gravity, deep purple and
violet with hints of magenta, soft volumetric inner glow, suspended dust
particles around, photographed on black background, cinematic, 8K,
seamless loop, very slow motion
```

#### Промпт №5 — туманность/частицы (если хочется только фон без объекта)

```
Slow-drifting cosmic nebula made of violet and indigo particles,
bioluminescent dust, deep space background, gentle parallax depth,
no camera movement, cinematic, seamless looping animation, brand violet
palette, no text, no objects
```

### Лайфхаки для AI-генерации

1. **Сначала картинка, потом видео.** Сгенерируй идеальный кадр в Midjourney/Flux/DALL-E → загрузи в Luma/Kling как `image-to-video` → попроси только «slow rotation» или «subtle drift». Так контролируешь композицию.

2. **Зацикливание.** AI почти всегда даёт не-loop. Чтобы сделать seamless:
   - Сгенерируй 8 сек
   - Возьми последний ~1 сек → сделай crossfade с первым (см. ffmpeg ниже)
   - Или: попроси AI «start frame matches end frame» (Runway понимает)

3. **Несколько генераций.** Цена низкая → нагенерируй 4–6 вариантов, выбери лучший. Первая попытка редко идеальна.

4. **Соотношение сторон.** Не забудь поставить **16:9** или **landscape** в настройках, иначе получишь квадрат/портрет.

---

## Путь 3 — Свой рендер в Blender (1–2 часа, максимум контроля)

Если хочется уникальности и есть базовое владение Blender.

### Пошагово

1. **Скачай Blender** (free): https://www.blender.org/download/

2. **Crystal mesh:**
   - https://polyhaven.com/models — поиск `crystal`, `gem`, `amethyst`
   - Или встроенный BlenderKit (фильтр Free): откроется внутри Blender, перетягиваешь модель в сцену
   - Или Sketchfab (https://sketchfab.com/3d-models — фильтры: Downloadable + CC0/CC-BY): `crystal cluster`, `amethyst geode`

3. **HDRI окружение:**
   - https://polyhaven.com/hdris (бесплатно, выбирай 1k для веба, ~1 МБ)
   - Рекомендую: `moonless_golf`, `studio_small_09`, `brown_photostudio_02`, `dikhololo_night`
   - В Blender: World → Surface → Background → Environment Texture → выбираешь .hdr

4. **Материал кристалла (Principled BSDF):**
   ```
   Base Color:    #7C3AED  (brand violet)
   Subsurface:    0.15
   Subsurface Color: #A78BFA
   Metallic:      0.0
   Roughness:     0.05
   IOR:           1.55
   Transmission:  1.0
   Transmission Roughness: 0.0
   ```
   Это даст полупрозрачный преломляющий аметист.

5. **Свет:**
   - Key light: Area light сверху-слева, размер 5m, power 500W, цвет тёплый белый
   - Rim light: Area сзади-снизу, power 200W, цвет cool blue
   - HDRI как fill

6. **Камера:**
   - Position: фронтально к объекту
   - Focal length: 50–85mm (без искажений)
   - DOF: включи, F-stop 1.4–2.8 для красивого bokeh

7. **Анимация:**
   - Выдели кристалл → I → Rotation → ставь keyframe на frame 1 (rot Y = 0°) и frame 240 (rot Y = 360°)
   - Это даст полный цикл за 10 сек @ 24fps → **гарантированный seamless loop**

8. **Рендер:**
   - Render Engine: Cycles
   - Resolution: 1920×1080 (или 2560×1440)
   - Samples: 128 (с denoise OptiX/OpenImageDenoise)
   - Frame range: 1 to 240
   - Output: PNG sequence в папку `/tmp/frames/`

9. **Склейка в MP4 через ffmpeg** (см. секцию ниже)

---

## FFmpeg — оптимизация и конверсия

Установи: `brew install ffmpeg` (macOS) или https://ffmpeg.org/download.html

### Базовая оптимизация исходника (любой формат → web-MP4)

```bash
cd ~/Desktop/Work/IT/SV-MITSKA/public/home

ffmpeg -i source.mp4 \
  -vf scale=1920:-2 \
  -c:v libx264 -crf 24 -preset slow \
  -pix_fmt yuv420p \
  -an \
  -movflags +faststart \
  hero-loop.mp4
```

**Что делает каждый флаг:**
- `-vf scale=1920:-2` — масштаб до 1920 по ширине, высота кратна 2 (требование H.264)
- `-c:v libx264` — кодек H.264
- `-crf 24` — качество (18=лучшее, 28=хуже; 22–26 — sweet spot для веба)
- `-preset slow` — лучшее сжатие за счёт времени кодирования
- `-pix_fmt yuv420p` — обязательно для Safari/QuickTime
- `-an` — удалить аудио
- `-movflags +faststart` — moov-atom в начало, чтобы стримилось без полной загрузки

### Если файл всё ещё > 4 МБ — агрессивнее

```bash
ffmpeg -i source.mp4 \
  -vf scale=1600:-2 \
  -c:v libx264 -crf 28 -preset veryslow \
  -pix_fmt yuv420p -an -movflags +faststart \
  hero-loop.mp4
```

### WebM VP9 (опционально, ~30% меньше для Chrome)

```bash
ffmpeg -i hero-loop.mp4 \
  -c:v libvpx-vp9 -crf 32 -b:v 0 \
  -row-mt 1 -tile-columns 2 -threads 8 \
  -an \
  hero-loop.webm
```
*(VP9 кодирует медленно — 5–15 мин на 10-сек ролик; можно оставить запущенным фоном.)*

### Постер (первый кадр)

```bash
ffmpeg -i hero-loop.mp4 \
  -vf "select=eq(n\,0)" \
  -vframes 1 -q:v 4 \
  hero-poster.jpg
```

Если первый кадр не идеален — выбери кадр посередине:
```bash
ffmpeg -i hero-loop.mp4 -ss 00:00:03 -vframes 1 -q:v 4 hero-poster.jpg
```

### Seamless loop из не-зацикленного видео (crossfade склейка)

Если AI/сток дали ролик без loop'а — склеиваем хвост с головой через 0.5 сек crossfade:

```bash
# 1. Определи длину
ffprobe -v quiet -show_entries format=duration -of default=nw=1:nk=1 source.mp4
# например, выдало 8.0

# 2. Сделай xfade-loop (для 8 сек видео с 0.5 сек overlap):
ffmpeg -i source.mp4 -filter_complex \
  "[0:v]split=2[a][b]; \
   [a]trim=0:7.5,setpts=PTS-STARTPTS[a1]; \
   [b]trim=7.5:8,setpts=PTS-STARTPTS[b1]; \
   [a1][b1]xfade=transition=fade:duration=0.5:offset=7" \
  -an hero-loop-seamless.mp4
```

### Обрезать видео по времени (если сток слишком длинный)

```bash
# Взять 8 сек с момента 0:00:05
ffmpeg -i source.mp4 -ss 00:00:05 -t 8 -c copy trimmed.mp4
```

### Реверс-палиндром (туда-обратно — гарантирует seamless)

Самый «грязный» но рабочий трюк: видео идёт вперёд, потом задом наперёд → всегда seamless.

```bash
ffmpeg -i source.mp4 -filter_complex \
  "[0:v]reverse[r]; [0:v][r]concat=n=2:v=1[out]" \
  -map "[out]" -an hero-loop-palindrome.mp4
```

Минус: иногда заметно, что движение идёт «назад». Для медленного вращения кристалла — практически незаметно.

### Цветокоррекция (если цвет не попадает в бренд)

```bash
# Сдвиг оттенка в фиолетовый + лёгкий contrast/saturation
ffmpeg -i source.mp4 \
  -vf "hue=h=15:s=1.15,eq=contrast=1.05:brightness=-0.02" \
  -c:v libx264 -crf 24 -an -movflags +faststart \
  recolored.mp4
```

Альтернатива — делать это **в CSS** (быстрее итерировать):
```css
/* в Hero.tsx, на <VideoBg> */
filter: hue-rotate(15deg) saturate(1.15) brightness(0.95);
```

---

## Проверка перед коммитом

```bash
# Размер файлов
ls -lh public/home/hero-loop.*

# Длительность
ffprobe -v quiet -show_entries format=duration -of default=nw=1:nk=1 \
  public/home/hero-loop.mp4

# Кодек/разрешение
ffprobe -v quiet -show_entries stream=codec_name,width,height -select_streams v \
  -of default=nw=1 public/home/hero-loop.mp4

# Проверь что +faststart применён (moov должно идти раньше mdat)
ffprobe -v trace public/home/hero-loop.mp4 2>&1 | grep -E "moov|mdat" | head -5
```

Чек-лист:
- [ ] `hero-loop.mp4` ≤ 4 МБ
- [ ] Длительность 6–10 сек
- [ ] H.264 + yuv420p
- [ ] Без звука
- [ ] `+faststart` стоит (moov перед mdat)
- [ ] Loop seamless (запусти `open hero-loop.mp4`, посмотри 3 цикла)
- [ ] `hero-poster.jpg` ≤ 150 КБ, выглядит как «нормальный» кадр (не размытый промежуточный)

---

## Подключение к сайту

Ничего делать не нужно — `Hero.tsx` уже знает про эти пути:

```typescript
// src/sections/home/Hero.tsx (строки 19–21)
const HERO_VIDEO_MP4 = '/home/hero-loop.mp4';
const HERO_VIDEO_WEBM = '/home/hero-loop.webm';
const HERO_POSTER = '/home/hero-poster.jpg';
```

Бросаешь файлы → `npm run dev` → видишь результат. Если хочешь другие имена/пути — отредактируй эти три константы.

### Если нужна цветокоррекция через CSS

В `Hero.tsx`, найди компонент `VideoBg` и добавь `filter`:

```typescript
const VideoBg = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  filter: hue-rotate(15deg) saturate(1.1) brightness(0.95); /* ← добавь */
`;
```

### Если хочешь mobile-версию (легче, чтобы не убить 4G)

В `Hero.tsx` поверх `<VideoBg>` можно добавить второй `<source>` с media query:

```jsx
<VideoBg autoPlay muted loop playsInline preload="metadata" poster={HERO_POSTER}>
  <source src="/home/hero-loop-mobile.webm" type="video/webm" media="(max-width: 768px)" />
  <source src="/home/hero-loop-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
  <source src={HERO_VIDEO_WEBM} type="video/webm" />
  <source src={HERO_VIDEO_MP4} type="video/mp4" />
</VideoBg>
```

Mobile-версию делаем тем же ffmpeg, только `-vf scale=960:-2 -crf 28`.

---

## Траблшутинг

### Видео не воспроизводится автоматически
- Проверь, что есть **оба** атрибута: `muted` + `playsInline` (без них iOS блокирует autoplay).
- Открой DevTools → Network → найди файл → статус должен быть `200` и `content-type: video/mp4`.
- Проверь, что MP4 имеет `+faststart` (без него Safari может ждать полной загрузки).

### Видео грузится медленно / заметная задержка
- Файл > 4 МБ — пережми с `-crf 28`.
- Нет `+faststart` — пережми с этим флагом.
- Нет постера — добавь, чтобы первый paint был мгновенным.
- На очень медленных сетях рассмотри `preload="none"` (вместо `metadata`) — но тогда первый paint будет только постер до явного play.

### Loop «дёргается»
- Видео не seamless — используй palindrome или crossfade (см. ffmpeg).
- Кадровая частота не кратна (например, 30fps в 8.13 сек) — обрежь до целого: `ffmpeg -i x.mp4 -t 8 ...`.

### Цвет смотрится «грязным» / тусклым
- Источник в HDR/Rec.2020 — конвертируй в sRGB: `-vf "colorspace=all=bt709:iall=bt2020:fast=1"`.
- Или просто CSS `filter: saturate(1.3) contrast(1.1)`.

### Mobile Safari тормозит
- Уменьши разрешение до 1280×720.
- Или подгружай облегчённую версию через `media`-атрибут на `<source>`.
- В крайнем случае — отключи видео под мобилку и оставь только постер + DOM-частицы (могу сделать).

---

## Промпты Midjourney / Flux / DALL-E для постера (или для image-to-video)

Если делаешь image-to-video через Luma/Kling — сначала сгенерируй идеальный кадр.

#### MJ-стиль (короткий):
```
amethyst crystal cluster floating in deep space, brand violet #A78BFA,
bokeh particles, cinematic photography, dark background, octane render,
8K, ultra detailed --ar 16:9 --v 6 --style raw
```

#### Длинный/Flux-стиль:
```
A stunning macro photograph of a glowing purple amethyst crystal cluster
floating weightlessly in deep cosmic space. The crystal has translucent
violet and indigo facets with internal light dispersion. Surrounding it,
soft out-of-focus bokeh particles drift through the frame in warm violet
and cool indigo tones. Shallow depth of field, shot on Hasselblad with
85mm f/1.4 lens. Dark navy background (#08060f), volumetric lighting from
upper left, brand color palette of #7C3AED, #A78BFA and #ECEBF3.
Hyper-realistic, cinematic, editorial quality, 16:9 aspect ratio
```

---

## Если совсем не находится / не получается

Скажи — я могу:
1. Сделать вариант **без видео** на статичной картинке + DOM-частицах (легче на 100%, выглядит на 80% так же).
2. Подключить **Spline** сцену (если выберешь готовую из их Community).
3. Помочь с **конкретной командой** ffmpeg для твоего конкретного файла — пришли название/длину и что не нравится.

---

**Главное правило:** сначала бросаешь файлы → смотришь в `npm run dev` → потом крутим цвет/тайминги. Не пытайся идеально подобрать видео в браузере перед скачиванием — глаз обманывает, в контексте сайта читается совсем иначе.
