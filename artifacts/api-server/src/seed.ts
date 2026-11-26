import { db, categoriesTable, activitiesTable } from "@workspace/db";
import { count, sql } from "drizzle-orm";

const SEED_CATEGORIES = [
  {
    "id": 1,
    "name": "野外活動",
    "nameEn": "Outdoor Activities",
    "icon": "🏕️",
    "color": "#2E7D32",
    "slug": "outdoor-activities"
  },
  {
    "id": 2,
    "name": "新興運動",
    "nameEn": "Emerging Sports",
    "icon": "⚽",
    "color": "#1565C0",
    "slug": "emerging-sports"
  },
  {
    "id": 3,
    "name": "中華文化活動",
    "nameEn": "Chinese Cultural Activities",
    "icon": "🏮",
    "color": "#C62828",
    "slug": "chinese-cultural-activities"
  },
  {
    "id": 4,
    "name": "影像及校園媒體",
    "nameEn": "Photography & School Media",
    "icon": "🎨",
    "color": "#6A1B9A",
    "slug": "visual-media-creation"
  },
  {
    "id": 6,
    "name": "生態探索",
    "nameEn": "Ecology Exploration",
    "icon": "🌿",
    "color": "#00695C",
    "slug": "ecology-exploration"
  },
  {
    "id": 7,
    "name": "歷奇訓練",
    "nameEn": "Adventure Training",
    "icon": "🧗",
    "color": "#5D4037",
    "slug": "adventure-training"
  },
  {
    "id": 8,
    "name": "環球文化體驗",
    "nameEn": "Global Cultural Experience",
    "icon": "🌏",
    "color": "#1565C0",
    "slug": "global-cultural-experience"
  },
  {
    "id": 9,
    "name": "AI教育及創作",
    "nameEn": "AI Education & Creation",
    "icon": "🤖",
    "color": "#6366f1",
    "slug": "ai-campus-courses"
  },
  {
    "id": 10,
    "name": "財商及生涯規劃",
    "nameEn": "Financial Literacy & Career Planning",
    "icon": "💰",
    "color": "#D97706",
    "slug": "financial-literacy-career-planning"
  }
];


const SEED_ACTIVITIES = [
  {"id":1,"title":"露營體驗","titleEn":"Camping Experience","description":"讓學生體驗野外露營的樂趣，學習搭建帳篷、生火煮食等野外求生技能。活動強調團隊合作及自我照顧能力。","descriptionEn":"Students experience the joy of outdoor camping, learning essential wilderness skills including tent setup, campfire cooking, and basic survival techniques. The programme emphasises teamwork and self-care in a natural environment.","categoryId":1,"targetGroup":["primary"],"duration":"1-2日","durationEn":"1-2 Days","minParticipants":20,"maxParticipants":40,"location":"本港各大營地","locationEn":"Various Campsites in Hong Kong","imageUrl":null,"images":["/camping-1.jpg","/camping-2.jpg","/camping-3.jpg","/camping-4.jpg","/camping-5.jpg","/camping-6.jpg"],"featured":false,"slug":"camping-experience","seoTitle":"School Camping Experience | JuntarHK","seoDescription":"Build independence, resilience and outdoor skills on JuntarHK's overnight camping experience at Hong Kong's best campsites. Perfect for primary and secondary school ECAs.","seoKeywords":"school camping Hong Kong,overnight camp,outdoor education,ECA camping,school trip Hong Kong","status":"published","tags":[]},
  {"id":2,"title":"攀石訓練","titleEn":"Rock Climbing Training","description":"由持牌教練帶領，學習安全攀石技術。適合培養學生的自信心、意志力及身體協調能力。","descriptionEn":"Led by licensed coaches, students learn safe rock climbing techniques that build confidence, determination, and physical coordination. A rewarding challenge that develops resilience and a sense of personal achievement.","categoryId":1,"targetGroup":["secondary","primary"],"duration":"半日","durationEn":"Half Day","minParticipants":10,"maxParticipants":20,"location":"室內攀石場","locationEn":"Indoor Climbing Wall","imageUrl":null,"images":["/climbing-1.jpg","/climbing-2.jpg","/climbing-3.jpg","/climbing-4.jpg"],"featured":false,"slug":"rock-climbing-training","seoTitle":"Rock Climbing Training for Schools | JuntarHK","seoDescription":"Challenge students physically and mentally with JuntarHK's Rock Climbing Training. Supervised indoor climbing sessions build confidence, strength and problem-solving skills.","seoKeywords":"rock climbing Hong Kong,school climbing programme,indoor climbing ECA,outdoor education Hong Kong,adventure sport school","status":"published","tags":[]},
  {"id":3,"title":"獨木舟體驗","titleEn":"Canoeing Experience","description":"於平靜水域學習獨木舟划艇技術，由獨木舟總會認可教練指導，安全有趣。","descriptionEn":"Students learn canoeing techniques on calm waters under the guidance of coaches accredited by the Canoe Union of Hong Kong. A safe, fun, and confidence-building experience on the water.","categoryId":1,"targetGroup":["secondary"],"duration":"半日","durationEn":"Half Day","minParticipants":10,"maxParticipants":20,"location":"西貢海域","locationEn":"Sai Kung Waters","imageUrl":null,"images":["/kayak-1.jpg","/kayak-2.jpg","/kayak-3.jpg","/kayak-4.jpg"],"featured":false,"slug":"canoeing-experience","seoTitle":"Canoeing Experience Sai Kung | JuntarHK","seoDescription":"Paddle through the stunning waters of Sai Kung on JuntarHK's Canoeing Experience. Build water confidence, teamwork and outdoor skills for Hong Kong school students.","seoKeywords":"canoeing Hong Kong,Sai Kung kayaking,water sports ECA,outdoor education,school water activity","status":"published","tags":[]},
  {"id":13,"title":"農耕體驗","titleEn":"Farm Experience","description":"親身體驗有機農耕，學習種植蔬菜、了解食物來源，培養學生對環境及農業的認識。","descriptionEn":"Students get hands-on experience with organic farming — planting vegetables, understanding where food comes from, and developing awareness of the environment and agriculture. A grounding experience that reconnects young people with nature.","categoryId":6,"targetGroup":["primary"],"duration":"半日","durationEn":"Half Day","minParticipants":15,"maxParticipants":30,"location":"新界農場","locationEn":"New Territories Farm","imageUrl":null,"images":["/farm-1.jpg","/farm-2.jpg","/farm-3.jpg","/farm-4.jpg","/farm-5.jpg","/farm-6.jpg","/farm-7.jpg","/farm-8.jpg"],"featured":false,"slug":"farm-experience","seoTitle":"Farm Experience for Schools | JuntarHK","seoDescription":"Connect students with nature and sustainable agriculture through JuntarHK's Farm Experience at New Territories farms. A hands-on ecology ECA for Hong Kong schools.","seoKeywords":"farm experience Hong Kong,agriculture education,ecology ECA,school farm visit,New Territories farm","status":"published","tags":[]},
  {"id":14,"title":"感官探索花園","titleEn":"Sensory Garden Exploration","description":"適合幼稚園小朋友的感官探索活動，透過觸摸、嗅聞及觀察植物，認識大自然的奇妙。","descriptionEn":"Designed for kindergarten children, this sensory exploration activity encourages touching, smelling, and observing plants to discover the wonders of the natural world. A gentle, joyful introduction to nature through the senses.","categoryId":6,"targetGroup":["kindergarten","primary","secondary"],"duration":"1.5小時","durationEn":"1.5 Hours","minParticipants":15,"maxParticipants":25,"location":"學校花園/公園","locationEn":"School Garden / Park","imageUrl":null,"images":["/sensory-1.jpg","/sensory-2.jpg","/sensory-3.jpg"],"featured":false,"slug":"sensory-garden-exploration","seoTitle":"Sensory Garden Exploration | JuntarHK","seoDescription":"Inspire curiosity and environmental awareness through hands-on sensory garden exploration. A perfect ecology ECA for Hong Kong kindergartens and primary schools.","seoKeywords":"sensory garden,ecology education,nature exploration,school garden activity,Hong Kong ECA","status":"published","tags":[]},
  {"id":15,"title":"紅樹林生態導覽","titleEn":"Mangrove Ecology Tour","description":"由生態導賞員帶領，認識紅樹林——招潮蟹和彈塗魚的家。利用顯微鏡等工具，發掘動植物的小秘密。進行科學實驗，思考如何為生物建立一個五星級的家。為何要在BulaLand舉辦活動？富經驗的專業導師、能同時容納多達200名學生進行活動、設有冷氣活動室及洗浴設備、位置便利，活動室與紅樹林相隔只有2分鐘步程、附設免費旅遊巴停車場。","descriptionEn":"Led by ecology guides, students explore the mangrove habitat — home to fiddler crabs and mudskippers. Using tools such as microscopes, they uncover the secrets of local flora and fauna, conduct science experiments, and consider how to create ideal conditions for wildlife. Highlights include experienced professional instructors, capacity for up to 200 students, air-conditioned activity rooms with shower facilities, and a location just 2 minutes from the mangrove.","categoryId":6,"targetGroup":["kindergarten","primary","secondary"],"duration":"3小時 / 3 Hours","durationEn":"3 Hours","minParticipants":15,"maxParticipants":200,"location":"Bula Land, 粉嶺沙頭角","locationEn":"Bula Land, Fanling Sha Tau Kok","imageUrl":null,"images":["/mangrove-1.jpg","/mangrove-2.jpg","/mangrove-3.jpg","/mangrove-4.jpg","/mangrove-5.jpg"],"featured":true,"slug":"mangrove-ecology-tour","seoTitle":"Mangrove Ecology Tour | JuntarHK","seoDescription":"Explore Hong Kong's vital mangrove wetlands with JuntarHK's guided Mangrove Ecology Tour at Bula Land in Fanling. An immersive outdoor ecology experience for school groups.","seoKeywords":"mangrove ecology tour,wetland education Hong Kong,ecology field trip,Bula Land Fanling,nature school trip","status":"published","tags":[]},
  {"id":16,"title":"校園運動日 — 趣動無限，創造非凡","titleEn":"Campus Sports Day","description":"新興運動體驗、運動攤位及流動體適能設備。結合多元化球類（健球、圓網球、匹克球、足網球）、投擲類（地板冰壺、芬蘭木棋、國皇棋、布袋球）及對戰類（激防箭、雪合戰），趣味多元化、快速易掌握、提升專注力。","descriptionEn":"A dynamic campus sports day featuring emerging sports, activity stations, and mobile fitness equipment. Incorporating diverse ball sports (KinBall, Roundnet, Pickleball, Futnet), throwing games (Floor Curling, Molkky, Kubb, Cornhole), and combat activities (Air Storm, Yukigassen) — all fun, fast to learn, and great for focus and concentration.","categoryId":2,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天 / 全天可選","durationEn":"Half Day / Full Day","minParticipants":30,"maxParticipants":300,"location":"學校操場 / 禮堂 / 戶外場地","locationEn":"School Playground / Hall / Outdoor Venue","imageUrl":null,"images":["/campus-sports-1.jpg","/campus-sports-2.jpg","/campus-sports-3.jpg","/campus-sports-4.jpg"],"featured":false,"slug":"campus-sports-day","seoTitle":"Campus Sports Day | JuntarHK","seoDescription":"Make your school sports day unforgettable. JuntarHK designs and delivers energetic Campus Sports Day events packed with emerging sports and team challenges for all ages.","seoKeywords":"school sports day Hong Kong,campus sports event,school ECA sports,emerging sports day,fun school activities","status":"published","tags":[]},
  {"id":17,"title":"新興球類體驗","titleEn":"Emerging Ball Sports Experience","description":"包括：健球 KinBall（全球最大運動球）、圓網球 Roundnet（蜘蛛網式競技）、匹克球 Pickleball、足網球 Futnet，以及 Omnikin Sport（Poison Ball、Omnikin Six、Super Rugby）。所有運動均趣味多元、快速易掌握，適合各年齡層學生。","descriptionEn":"Experience a range of exciting modern sports including KinBall (the world's biggest sports ball), Roundnet (spider-web-style competition), Pickleball, Futnet, and Omnikin sports (Poison Ball, Omnikin Six, Super Rugby). All activities are fun, fast to learn, and suitable for students of all ages.","categoryId":2,"targetGroup":["kindergarten","primary","secondary"],"duration":"1-2小時","durationEn":"1-2 Hours","minParticipants":15,"maxParticipants":100,"location":"學校操場 / 體育館","locationEn":"School Playground / Sports Hall","imageUrl":null,"images":["/ballsports-1.jpg","/ballsports-2.jpg"],"featured":false,"slug":"emerging-ball-sports-experience","seoTitle":"Emerging Ball Sports Experience | JuntarHK","seoDescription":"Discover exciting new ball sports from around the world with JuntarHK's Emerging Ball Sports Experience. A fun and energetic ECA for all school levels.","seoKeywords":"emerging ball sports,new sports Hong Kong,school sports ECA,ball games school,sports experience Hong Kong","status":"published","tags":[]},
  {"id":18,"title":"投擲類新興運動","titleEn":"Throwing & Target Sports","description":"包括：地板冰壺 Floor Curling、芬蘭木棋 Molkky、國皇棋 Kubb、布袋球 Cornhole、軟式飛鏢 Soft Darts、射箭 Archery。訓練精準度與手眼協調，老少咸宜，特別適合作學校運動攤位活動。","descriptionEn":"Explore a variety of target and throwing sports including Floor Curling, Molkky (Finnish skittles), Kubb, Cornhole, Soft Darts, and Archery. These activities develop precision and hand-eye coordination, making them ideal for all ages and perfect as school sports booth activities.","categoryId":2,"targetGroup":["kindergarten","primary","secondary"],"duration":"1-2小時","durationEn":"1-2 Hours","minParticipants":10,"maxParticipants":80,"location":"學校操場 / 禮堂","locationEn":"School Playground / Hall","imageUrl":null,"images":["/throwing-1.jpg","/throwing-2.jpg","/throwing-3.jpg","/throwing-4.jpg"],"featured":false,"slug":"throwing-target-sports","seoTitle":"Throwing & Target Sports | JuntarHK","seoDescription":"Sharpen aim, focus and coordination with JuntarHK's Throwing & Target Sports. Featuring a variety of exciting throwing and target disciplines for all school ages.","seoKeywords":"throwing sports school,target sports ECA,emerging sports Hong Kong,school sports programme,coordination training","status":"published","tags":[]},
  {"id":19,"title":"對戰類新興運動","titleEn":"Battle & Team Combat Sports","description":"包括：激防箭 Air Storm（泡沫箭對戰）、雪合戰 Yukigassen（雪球格鬥）、躲避盤 Dodgebee、卡巴迪 Kabaddi，以及美式躲避球 American Dodgeball。激烈刺激，培養團隊默契與競爭意志。","descriptionEn":"High-energy team combat activities including Air Storm (foam arrow battles), Yukigassen (snowball fights), Dodgebee, Kabaddi, and American Dodgeball. These exciting games build teamwork, communication, and competitive spirit.","categoryId":2,"targetGroup":["kindergarten","primary","secondary"],"duration":"1-2小時","durationEn":"1-2 Hours","minParticipants":20,"maxParticipants":100,"location":"學校操場 / 體育館","locationEn":"School Playground / Sports Hall","imageUrl":null,"images":["/competitive-1.jpg","/competitive-2.jpg","/competitive-3.jpg"],"featured":false,"slug":"battle-team-combat-sports","seoTitle":"Battle & Team Combat Sports | JuntarHK","seoDescription":"Get competitive! JuntarHK's Battle & Team Combat Sports introduces exciting new competitive sports to Hong Kong school playgrounds and sports halls.","seoKeywords":"team combat sports,battle sports school,emerging sports Hong Kong,school sports ECA,competitive activities","status":"published","tags":[]},
  {"id":20,"title":"抱石工作坊","titleEn":"Bouldering Workshop","description":"由專業教練帶領，在室內攀石牆體驗攀石樂趣。三大目標：（1）提供正面動力，鼓勵年輕人面對挑戰和克服困難；（2）培養團隊合作，在攀石訓練中學習共同支持和合作；（3）建立自信心，通過攀石經驗激發年輕人的潛力和突破能力限制。課程對象：全港中小學生。","descriptionEn":"Professional coaches guide students on indoor bouldering walls. Three core goals: (1) provide positive motivation to help young people face challenges and overcome obstacles; (2) build teamwork through mutual support in climbing training; (3) develop self-confidence by unlocking each student's potential. Open to all primary and secondary school students in Hong Kong.","categoryId":7,"targetGroup":["kindergarten","primary","secondary"],"duration":"3小時","durationEn":"3 Hours","minParticipants":10,"maxParticipants":40,"location":"室內攀石牆","locationEn":"Indoor Climbing Wall","imageUrl":null,"images":["/bouldering-1.jpg","/bouldering-2.jpg","/bouldering-3.jpg"],"featured":false,"slug":"bouldering-workshop","seoTitle":"Bouldering Workshop for Schools | JuntarHK","seoDescription":"No ropes, pure skill. JuntarHK's Bouldering Workshop introduces students to this fast-growing sport in a safe indoor environment, perfect for all fitness levels.","seoKeywords":"bouldering workshop Hong Kong,indoor climbing school,adventure sport ECA,bouldering for students,climbing training","status":"published","tags":[]},
  {"id":21,"title":"校園歷奇活動 — 價值觀教育","titleEn":"Campus Adventure — Values Education","description":"以經驗學習法、探索實踐、體驗式學習為核心。培養學生：堅毅、尊重他人；責任感、承擔精神；仁愛、團結、同理心。活動包括繩網歷奇、高空挑戰（繩降、高欄）、竹筏製作等戶外歷奇項目，以及系列領袖培訓課程（SU選舉、四會訓練、風紀訓練等）。","descriptionEn":"Centred on experiential learning, exploration, and practice, this programme cultivates key values including perseverance, respect, responsibility, commitment, compassion, solidarity, and empathy. Activities include rope net adventures, high-element challenges (abseiling, high-bar obstacles), bamboo raft building, and a series of leadership training programmes (student union elections, four-committee training, prefect training, and more).","categoryId":7,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":200,"location":"Bula Land / 戶外場地","locationEn":"Bula Land / Outdoor Venue","imageUrl":null,"images":["/campus-1.jpg","/campus-2.jpg","/campus-3.jpg","/campus-4.jpg"],"featured":false,"slug":"campus-adventure-values-education","seoTitle":"Campus Adventure Values Education | JuntarHK","seoDescription":"Foster positive values through adventure. JuntarHK's Campus Adventure — Values Education uses experiential activities to build respect, responsibility and perseverance in students.","seoKeywords":"values education Hong Kong,adventure learning school,experiential education,character development ECA,school values programme","status":"published","tags":[]},
  {"id":22,"title":"繩網歷奇挑戰","titleEn":"High Ropes Adventure Challenge","description":"體驗中國香港挑戰網陣協會認可的高低結構繩網課程，包括高空繩橋、單繩橋及各類高空元素。由持有繩網教練資格的導師帶領，在安全環境下挑戰自我。培養堅毅精神、信任感及突破限制的勇氣。","descriptionEn":"Experience Hong Kong Challenge Ropes Course Association-accredited high and low ropes elements, including aerial rope bridges, single-strand bridges, and various high-element challenges. Led by certified ropes course instructors, students push their limits in a safe environment, building perseverance, trust, and the courage to break personal boundaries.","categoryId":7,"targetGroup":["kindergarten","primary","secondary"],"duration":"3小時","durationEn":"3 Hours","minParticipants":15,"maxParticipants":60,"location":"Bula Land / 戶外繩網場地","locationEn":"Bula Land / Outdoor Ropes Course","imageUrl":null,"images":["/rope-1.jpg","/rope-2.jpg","/rope-3.jpg","/rope-4.jpg","/rope-5.jpg","/rope-6.jpg","/rope-7.jpg","/rope-8.jpg","/rope-9.jpg","/rope-10.jpg"],"featured":true,"slug":"high-ropes-adventure-challenge","seoTitle":"High Ropes Adventure Challenge | JuntarHK","seoDescription":"Push boundaries and build confidence with JuntarHK's High Ropes Adventure Challenge at Bula Land. An exhilarating outdoor adventure ECA for Hong Kong school groups.","seoKeywords":"high ropes adventure,ropes course Hong Kong,adventure ECA school,outdoor challenge,Bula Land activities","status":"published","tags":[]},
  {"id":23,"title":"領袖培訓計劃","titleEn":"Leadership Development Programme","description":"針對中學學生組織（SU、四會、風紀）及各類領袖培訓需求，活動涵蓋：SU選舉培訓、中一新生入學適應、生涯規劃工作坊、學生大使計劃、家長教師聯誼、學校旅行統籌等。以體驗學習為主，訓練溝通、決策及領袖才能。","descriptionEn":"Tailored for secondary school student organisations (student unions, school committees, prefect bodies) and leadership development needs. The programme covers student union election training, S1 orientation, career planning workshops, student ambassador schemes, PTA activities, and school trip coordination. Experiential learning develops communication, decision-making, and leadership skills.","categoryId":7,"targetGroup":["secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":150,"location":"學校 / 戶外場地","locationEn":"School / Outdoor Venue","imageUrl":null,"images":["/leadership-1.jpg","/leadership-2.jpg","/leadership-3.jpg","/leadership-4.jpg","/leadership-5.jpg","/leadership-6.jpg","/leadership-7.jpg","/leadership-8.jpg"],"featured":false,"slug":"leadership-development-programme","seoTitle":"Leadership Development Programme | JuntarHK","seoDescription":"Empower students with leadership, resilience and teamwork through JuntarHK's adventure-based Leadership Development Programme, tailored for Hong Kong primary and secondary schools.","seoKeywords":"leadership development programme,team building Hong Kong,school leadership training,adventure education ECA,leadership school Hong Kong","status":"published","tags":[]},
  {"id":25,"title":"山野探索生態考察","titleEn":"Nature Trail & Ecology Survey","description":"由生態導師帶領進行山野探索：（1）認識名種昆蟲，了解其生態及習性；（2）植物分類認識活動，培養細心觀察大自然；（3）建立臨時庇護點，學習如何在戶外保護自己。在溪澗進行生態觀察，了解水生生物的多樣性，學習水處理技巧及陶泥製作。","descriptionEn":"Led by ecology instructors, students explore trails and hillsides, learning about insects and their habitats, classifying and identifying plants, and building temporary shelters. Ecological observations in streams reveal aquatic biodiversity. Students also practise water treatment techniques and try their hand at clay craft.","categoryId":6,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天","durationEn":"Half Day","minParticipants":15,"maxParticipants":60,"location":"自然生態教育徑","locationEn":"Nature Ecology Trail","imageUrl":null,"images":["/ecology-1.jpg","/ecology-2.jpg","/ecology-3.jpg"],"featured":false,"slug":"nature-trail-ecology-survey","seoTitle":"Nature Trail & Ecology Survey | JuntarHK","seoDescription":"Explore Hong Kong's natural habitats with JuntarHK's Nature Trail & Ecology Survey. Students conduct field surveys and develop appreciation for local biodiversity.","seoKeywords":"ecology survey,nature trail Hong Kong,environmental education,school nature walk,biodiversity ECA","status":"published","tags":[]},
  {"id":26,"title":"野炊烹食訓練","titleEn":"Wild Cooking Training","description":"在大自然煮食，考驗默契的挑戰！訓練目標：（1）問題解決能力及資源管理技巧——在野炊實戰中學習分配、做出決策；（2）培養團隊溝通與協作；（3）創意思維、認識大自然；（4）建立深厚團隊信任與默契。活動流程：團隊分組→食材收集與準備→野炊烹煮→料理分享與評比→團隊反思。對象：中小學生，參與人數30-50人。","descriptionEn":"A teamwork challenge like no other — cooking together in the outdoors! Training objectives: (1) problem-solving and resource management in real outdoor cooking; (2) develop team communication and collaboration; (3) creative thinking and appreciation of nature; (4) build deep team trust and chemistry. Programme flow: team formation → ingredient gathering and preparation → outdoor cooking → sharing and tasting → team reflection. Suitable for 30–50 students.","categoryId":1,"targetGroup":["kindergarten","primary","secondary"],"duration":"3-4小時","durationEn":"3-4 Hours","minParticipants":30,"maxParticipants":50,"location":"戶外","locationEn":"Outdoor","imageUrl":null,"images":["/cooking-1.jpg","/cooking-2.jpg","/cooking-3.jpg","/cooking-4.jpg","/cooking-5.jpg","/cooking-6.jpg"],"featured":false,"slug":"wild-cooking-training","seoTitle":"Wild Cooking Training | JuntarHK","seoDescription":"Learn to cook in the wild! JuntarHK's Wild Cooking Training teaches outdoor culinary skills, fire safety and teamwork in a hands-on outdoor setting for school groups.","seoKeywords":"wild cooking,outdoor cooking school,survival skills ECA,outdoor education Hong Kong,camp cooking","status":"published","tags":[]},
  {"id":27,"title":"青少年野外求生術","titleEn":"Youth Wilderness Survival Skills","description":"自我保護意識、基本求生技術、團隊合作能力。培養學生：自信獨立、解決困難；提升效能、合作精神；堅韌、積極應對挑戰。課程涵蓋：（1）求生基本知識——了解野外危險、基本求生工具、發送求救信號；（2）基本求生技術——繩索技術、生火技巧、尋找水源；（3）團隊合作實踐——搭建臨時庇護所。","descriptionEn":"Developing self-protection awareness, basic survival techniques, and teamwork. Students build confidence and independence, improve efficiency and cooperative spirit, and develop resilience. The programme covers: (1) survival basics — recognising outdoor hazards, essential tools, and distress signalling; (2) practical skills — rope techniques, fire starting, finding water sources; (3) team practice — building a temporary shelter together.","categoryId":1,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":15,"maxParticipants":60,"location":"戶外 / Bula Land","locationEn":"Outdoor / Bula Land","imageUrl":null,"images":["/survival-1.jpg","/survival-2.jpg","/survival-3.jpg"],"featured":false,"slug":"youth-wilderness-survival-skills","seoTitle":"Youth Wilderness Survival Skills | JuntarHK","seoDescription":"Prepare students for the outdoors with JuntarHK's Youth Wilderness Survival Skills. Covering navigation, shelter, fire-making and first aid in a real outdoor environment.","seoKeywords":"wilderness survival skills,outdoor survival Hong Kong,youth survival training,school outdoor ECA,Bula Land","status":"published","tags":[]},
  {"id":28,"title":"搭棚體驗工作坊","titleEn":"Bamboo Scaffolding Workshop","description":"體驗香港獨有的竹棚搭建技藝，由專業師傅講解及示範傳統搭棚工藝，學員親身實踐竹棚結構搭建，深入了解這項列入香港非物質文化遺產的傳統行業技藝。","descriptionEn":"Experience Hong Kong's unique art of bamboo scaffolding. Professional scaffolders explain and demonstrate traditional bamboo scaffolding techniques, and participants get hands-on experience constructing bamboo structures — gaining an in-depth understanding of this craft listed as a Hong Kong Intangible Cultural Heritage.","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"2-3小時","durationEn":"2-3 Hours","minParticipants":15,"maxParticipants":40,"location":"學校 / 戶外場地","locationEn":"School / Outdoor Venue","imageUrl":null,"images":["/bamboo-1.jpg","/bamboo-2.jpg","/bamboo-3.jpg"],"featured":false,"slug":"bamboo-scaffolding-workshop","seoTitle":"Bamboo Scaffolding Workshop | JuntarHK","seoDescription":"Try the ancient craft of bamboo scaffolding with JuntarHK's hands-on workshop. Students discover this unique Hong Kong heritage skill while developing teamwork and engineering thinking.","seoKeywords":"bamboo scaffolding workshop,Hong Kong heritage,Chinese culture ECA,bamboo craft school,traditional skills Hong Kong","status":"published","tags":[]},
  {"id":29,"title":"野外定向","titleEn":"Orienteering","description":"利用地圖及指南針在野外進行定向跑步，訓練地圖閱讀、方向判斷及快速決策能力。學生需在規定時間內找出各個檢查點，考驗個人及團隊的合作能力與策略思維。適合作為課外活動、聯課活動或體育日項目。","descriptionEn":"Using maps and compasses, students navigate the outdoors, training map-reading, directional judgement, and rapid decision-making skills. Participants must locate checkpoints within a set time, testing both individual ability and team strategy. Ideal as an extra-curricular, co-curricular, or sports day activity.","categoryId":1,"targetGroup":["kindergarten","primary","secondary"],"duration":"2-3小時","durationEn":"2-3 Hours","minParticipants":20,"maxParticipants":100,"location":"Bula Land / 戶外場地","locationEn":"Bula Land / Outdoor Venue","imageUrl":null,"images":["/orienteering-1.jpg","/orienteering-2.jpg","/orienteering-3.jpg","/orienteering-4.jpg"],"featured":false,"slug":"orienteering","seoTitle":"School Orienteering Programme | JuntarHK","seoDescription":"Navigate, explore and compete! JuntarHK's Orienteering programme develops map reading, problem-solving and teamwork through exciting outdoor navigation challenges.","seoKeywords":"orienteering Hong Kong,outdoor navigation school,map reading ECA,outdoor education activity,Bula Land orienteering","status":"published","tags":[]},
  {"id":30,"title":"烽火台 — 竹製烽火台搭建挑戰","titleEn":"Beacon Tower — Bamboo Building Challenge","description":"在協作與創造過程中鑄就團隊的里程碑！團隊合作實戰、創意結構設計、高效溝通訓練、問題解決能力。流程：（1）團隊分組——每組負責搭建烽火台不同部分（基座、塔身、裝飾等），透過分工合作形成完整竹製烽火台；（2）材料收集與設計——各隊進行作戰會議，模擬企業決策，制定策略；（3）實際建造——合作測量、切割、捆綁竹子，搭建安全竹框架；（4）烽火展示儀式——完成建造後，所有成員爬上烽火台拍照或展示；（5）反思與總結——分享設計理念及合作心得。由具豐富經驗的專業建築師和搭棚師傅導師團隊指導。","descriptionEn":"Forge team milestones through collaboration and creativity! Focuses on: practical teamwork, creative structural design, effective communication, and problem-solving. Teams build a bamboo beacon tower together — from a war-room planning session to hands-on measuring, cutting, and binding — culminating in a commemorative group photo atop the completed tower. Guided by experienced professional architects and scaffolding masters.","categoryId":7,"targetGroup":["kindergarten","primary","secondary"],"duration":"3-4小時","durationEn":"3-4 Hours","minParticipants":20,"maxParticipants":200,"location":"戶外 / 室內","locationEn":"Outdoor / Indoor","imageUrl":null,"images":["/beacon-1.jpg","/beacon-2.jpg","/beacon-3.jpg","/beacon-4.jpg"],"featured":false,"slug":"beacon-tower-bamboo-building-challenge","seoTitle":"Beacon Tower Bamboo Building Challenge | JuntarHK","seoDescription":"Collaborate and build! JuntarHK's Beacon Tower Challenge has teams construct bamboo structures, developing STEM thinking, creativity and communication skills.","seoKeywords":"bamboo building challenge,STEM team challenge,adventure ECA Hong Kong,bamboo construction school,creative team building","status":"published","tags":[]},
  {"id":31,"title":"Formula 1 極速挑戰","titleEn":"Formula 1 Speed Challenge","description":"在速度與協作中衝刺團隊的里程碑！團隊協作實戰、創意賽車設計、高效率溝通訓練、問題解決能力。流程：（1）破冰與分組——分成若干小隊，共同完成賽車設計、挑戰關卡及接力競賽；（2）賽車設計與製作——各隊領取材料包，進行作戰會議，動手測量、組裝、裝飾，打造專屬賽車；（3）極速挑戰站——小隊需協同完成趣味關卡，贏取升級配件；隊員輪流擔任「車手」完成接力圈；（4）反思與總結——教練或主持人給予具體回饋，強化團隊效能。適合60人以上的大型團隊。","descriptionEn":"Sprint toward team milestones with speed and collaboration! Focuses on teamwork in action, creative race car design, efficient communication, and problem-solving. Teams design and build their own race car, complete fun challenge stations to earn upgrade components, then compete in relay laps. Coaches provide specific feedback throughout. Best suited for groups of 60 or more.","categoryId":2,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天 / 全天","durationEn":"Half Day / Full Day","minParticipants":60,"maxParticipants":300,"location":"戶外 / 室內","locationEn":"Outdoor / Indoor","imageUrl":null,"images":["/f1-1.jpg","/f1-2.jpg","/f1-3.jpg","/f1-4.jpg","/f1-5.jpg"],"featured":true,"slug":"formula-1-speed-challenge","seoTitle":"Formula 1 Speed Challenge | JuntarHK","seoDescription":"Rev up the excitement with JuntarHK's Formula 1 Speed Challenge — a hands-on STEM and sports activity where students design, build and race miniature cars.","seoKeywords":"Formula 1 school activity,STEM racing challenge,emerging sports ECA,school speed challenge,F1 in schools Hong Kong","status":"published","tags":[]},
  {"id":32,"title":"War Game — 團隊戰略訓練","titleEn":"War Game — Team Strategy Training","description":"在戰略對決中激發團隊最高戰力！目標：（1）提升領導力與決策力——擔任隊長，在壓力下做出關鍵決策；（2）強化團隊溝通與協作——學習高效溝通，達成共同目標；（3）激發創新與應變思維——突破常規，動態調整戰略克敵制勝；（4）建立深層團隊信任與默契。流程：破冰與分組→戰略規劃（各隊進行作戰會議，模擬企業決策）→對戰演練（攻防戰、奪旗戰、救援任務）→戰後回顧（各隊分享對戰心得，教練提供專業分析）。特別適合領袖生及制服團體。","descriptionEn":"Unleash your team's full potential in strategic combat! Objectives: (1) develop leadership and decision-making under pressure; (2) strengthen team communication and collaboration; (3) spark innovation and adaptability; (4) build deep team trust and chemistry. Programme flow: icebreaker and team formation → strategic planning → combat drills (assault, capture-the-flag, rescue missions) → post-game review with coach analysis. Especially suitable for student leaders and uniformed groups.","categoryId":7,"targetGroup":["secondary"],"duration":"半日 / 全天","durationEn":"Half Day / Full Day","minParticipants":20,"maxParticipants":200,"location":"戶外 / 室內","locationEn":"Outdoor / Indoor","imageUrl":null,"images":["/wargame-1.jpg","/wargame-2.jpg","/wargame-3.jpg","/wargame-4.jpg","/wargame-5.jpg","/wargame-6.jpg","/wargame-7.jpg"],"featured":false,"slug":"war-game-team-strategy-training","seoTitle":"War Game Team Strategy Training | JuntarHK","seoDescription":"Build tactical thinking and teamwork with JuntarHK's War Game — Team Strategy Training. An exhilarating adventure activity for Hong Kong school team-building events.","seoKeywords":"war game school,team strategy training,adventure team building,school ECA Hong Kong,tactical training","status":"published","tags":[]},
  {"id":33,"title":"薩摩亞文化體驗日","titleEn":"Samoan Cultural Day","description":"親身感受薩摩亞獨特的波利尼西亞傳統文化，包括地道的藝術、音樂、舞蹈、美食及傳統手工藝等活動。十大精彩活動內容：（1）傳統節慶遊戲；（2）椰子去殼體驗；（3）徒手生火體驗；（4）傳統煮食體驗；（5）蕉葉編織；（6）傳統圖騰繪畫；（7）火舞練習體驗；（8）民族手工；（9）薩摩亞拍子舞（SIVA舞蹈）；（10）火舞表演（單火刀、雙火刀、女生舞蹈表演）。美食文化：體驗傳統料理如PALUSAMI（椰奶與面包果）、地下烤食物（LOVO）。由專業薩摩亞舞蹈表演者及文化導師主持。","descriptionEn":"Experience the unique Polynesian traditions of Samoa firsthand, including indigenous arts, music, dance, cuisine, and traditional crafts. Ten exciting activities: traditional festival games, coconut husking, hand fire-starting, traditional cooking, banana leaf weaving, totem painting, fire dance practice, ethnic handicrafts, the Samoan Siva dance, and a fire dance performance. Traditional cuisine includes Palusami (coconut cream with breadfruit) and underground oven cooking (Lovo). Hosted by professional Samoan performers and cultural instructors.","categoryId":8,"targetGroup":["kindergarten","primary","secondary"],"duration":"4-5小時","durationEn":"4-5 Hours","minParticipants":20,"maxParticipants":300,"location":"戶外","locationEn":"Outdoor","imageUrl":"/samoan-cultural-day.jpg","images":["/samoa-1.jpg","/samoa-2.jpg","/samoa-3.jpg","/samoa-4.jpg","/samoa-5.jpg"],"featured":true,"slug":"samoan-cultural-day","seoTitle":"Samoan Cultural Day | JuntarHK","seoDescription":"Experience the vibrant culture of Samoa with JuntarHK's Samoan Cultural Day. Students explore Pacific Island traditions, music, dance and games in an immersive outdoor setting.","seoKeywords":"Samoan cultural day,Pacific culture school,global culture ECA,multicultural education Hong Kong,cultural experience school","status":"published","tags":[]},
  {"id":36,"title":"森林體驗日","titleEn":"Forest Experience Day","description":"認識大自然、感恩心態、責任感、合作精神、認決困難、自我認知。山野探索、認識各種昆蟲、了解其生態及習性、植物分類與識別活動、培養細心觀察大自然。生態觀察、進行生態觀察、了解水生生物的多樣性、水族遊寶物、學習水中生命的重要性及如何保護水域。野外求生技巧、學習生火的三角形原則、了解燃燒的必要性、親自體驗生火過程、並在安全的環境中學習如何點燃火焰。掌握基本維索技術、學會使用繩結與固定位置。適合小學生和幼稚園。","descriptionEn":"Appreciate nature and cultivate gratitude, responsibility, and resilience. Trail exploration: identify insects and discover their ecology; classify and identify plants; develop careful observation of the natural world. Ecological observation: discover aquatic biodiversity and learn how to protect water habitats. Wilderness survival: learn the fire triangle, experience fire-starting safely, and master basic rope techniques and knot tying. Suitable for primary school students and kindergarteners.","categoryId":6,"targetGroup":["kindergarten","primary","secondary"],"duration":"半日","durationEn":"Half Day","minParticipants":10,"maxParticipants":40,"location":"森林/大自然","locationEn":"Forest / Nature","imageUrl":null,"images":["/forest-1.jpg","/forest-2.jpg","/forest-3.jpg","/forest-4.jpg","/forest-5.jpg","/forest-6.jpg"],"featured":true,"slug":"forest-experience-day","seoTitle":"Forest Experience Day | JuntarHK","seoDescription":"Step into the forest and discover the natural world with JuntarHK's Forest Experience Day. Students explore woodland ecosystems and develop a love for nature.","seoKeywords":"forest experience,nature education Hong Kong,ecology school trip,forest school day,environmental education","status":"published","tags":[]},
  {"id":37,"title":"基礎攝影課程","titleEn":"Basic Photography Course","description":"從零開始學習攝影基礎知識，涵蓋相機操作、曝光三角、構圖技巧及基本後期處理，適合從未接觸攝影的同學。","descriptionEn":"Learn the fundamentals of photography from scratch, covering camera operation, the exposure triangle, composition techniques, and basic post-processing. Ideal for students with no prior photography experience.","categoryId":4,"targetGroup":["secondary"],"duration":"半日至全日","durationEn":"Half Day to Full Day","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-basic-1.jpg","/photo-basic-2.jpg","/photo-basic-3.jpg"],"featured":true,"slug":"basic-photography-course","seoTitle":"Basic Photography Course for Schools | JuntarHK","seoDescription":"Introduce students to the art of photography with JuntarHK's Basic Photography Course. Covering composition, lighting and camera techniques for all school levels.","seoKeywords":"basic photography course,school photography,visual arts ECA Hong Kong,photography for students","status":"published","tags":[],"finalOutcome":"個人攝影作品集","finalOutcomeLabel":"學生成果"},
  {"id":38,"title":"手機攝影課程","titleEn":"Mobile Photography Course","description":"善用智能手機拍出專業級照片，學習構圖、光線運用、後期修圖App操作，讓日常隨手一拍成為精彩作品。","descriptionEn":"Use your smartphone to take professional-quality photos. Learn composition, light management, and photo editing app techniques — transforming everyday snapshots into outstanding images.","categoryId":4,"targetGroup":["kindergarten","primary","secondary"],"duration":"半日","durationEn":"Half Day","minParticipants":10,"maxParticipants":40,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-mobile-1.jpg","/photo-mobile-2.jpg","/photo-mobile-3.jpg","/photo-mobile-4.jpg","/photo-mobile-5.jpg"],"featured":false,"slug":"mobile-photography-video","seoTitle":"Mobile Photography Course for Schools | JuntarHK","seoDescription":"Turn every student into a photographer with just a smartphone. JuntarHK's Mobile Photography Course teaches composition, lighting and editing using mobile devices.","seoKeywords":"mobile photography course,smartphone photography school,ECA photography Hong Kong,photography for teens","status":"published","tags":[],"finalOutcome":"手機攝影作品集或主題相冊","finalOutcomeLabel":"學生成果"},
  {"id":39,"title":"影片拍攝及製作工作坊","titleEn":"Video Filming & Production Workshop","description":"學習影片拍攝技巧、鏡頭語言、剪輯技術及聲音設計，從策劃到成片，完整體驗影片製作流程。","descriptionEn":"Learn video filming techniques, visual storytelling, editing skills, and sound design — experiencing the complete production process from concept to finished film.","categoryId":4,"targetGroup":["secondary"],"duration":"全日","durationEn":"Full Day","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-video-prod-1.jpg","/photo-video-prod-2.jpg","/photo-video-prod-3.jpg"],"featured":false,"slug":"video-filming-production-workshop","seoTitle":"Video Filming & Production Workshop | JuntarHK","seoDescription":"Lights, camera, action! JuntarHK's Video Filming & Production Workshop guides students through the full filmmaking process from scripting to final edit.","seoKeywords":"video production workshop,filmmaking school,ECA video Hong Kong,student film programme,media arts","status":"published","tags":[],"finalOutcome":"完整主題短片","finalOutcomeLabel":"學生成果"},
  {"id":40,"title":"社交媒體推廣與影視製作","titleEn":"Social Media & Video Production","description":"結合短片拍攝與社交媒體運營策略，學習如何製作吸引眼球的內容，提升品牌形象與傳播效果。","descriptionEn":"Combining short video production with social media strategy, students learn to create eye-catching content that builds brand image and maximises reach across digital platforms.","categoryId":4,"targetGroup":["secondary"],"duration":"全日","durationEn":"Full Day","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-social-media-1.jpg","/photo-social-media-2.jpg","/photo-social-media-3.jpg"],"featured":false,"slug":"social-media-video-production","seoTitle":"Social Media & Video Production Workshop | JuntarHK","seoDescription":"Equip students with real-world digital skills. JuntarHK's Social Media & Video Production programme covers content creation, filming and editing for modern platforms.","seoKeywords":"social media workshop,video production school,digital media ECA,content creation Hong Kong,school media programme","status":"published","tags":[],"finalOutcome":"社交媒體短片及內容計劃","finalOutcomeLabel":"學生成果"},
  {"id":41,"title":"運動攝影課程","titleEn":"Sports Photography Course","description":"掌握追蹤移動主體的拍攝技巧，包括連拍設定、預判時機與構圖，捕捉最精彩的運動瞬間。","descriptionEn":"Master the techniques of photographing moving subjects, including burst mode settings, anticipating the moment, and composition — capturing the most exciting sporting moments on camera.","categoryId":4,"targetGroup":["secondary"],"duration":"半日至全日","durationEn":"Half Day to Full Day","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-sports-1.jpg","/photo-sports-2.jpg","/photo-sports-3.jpg","/photo-sports-4.jpg","/photo-sports-5.jpg","/photo-sports-6.jpg"],"featured":true,"slug":"sports-photography-course","seoTitle":"Sports Photography Course | JuntarHK","seoDescription":"Capture the action! JuntarHK's Sports Photography Course teaches students to shoot dynamic sports images using professional techniques, ideal for secondary school ECAs.","seoKeywords":"sports photography,school photography course,visual arts ECA,photography training Hong Kong","status":"published","tags":[],"finalOutcome":"運動攝影作品集","finalOutcomeLabel":"學生成果"},
  {"id":42,"title":"校園記者計劃","titleEn":"School Reporter Programme","description":"培訓學生成為校園記者，學習採訪技巧、新聞攝影、撰稿及排版，提升表達與媒體素養。","descriptionEn":"Train students as school reporters, learning interviewing techniques, photojournalism, writing, and layout — developing communication skills and media literacy.","categoryId":4,"targetGroup":["secondary"],"duration":"學期計劃","durationEn":"Semester Programme","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-journalist-1.jpg","/photo-journalist-2.jpg","/photo-journalist-3.jpg"],"featured":false,"slug":"campus-reporter-tv","seoTitle":"School Reporter Programme | JuntarHK","seoDescription":"Transform students into young journalists! JuntarHK's School Reporter Programme develops media literacy, interview skills and video production across a full semester.","seoKeywords":"school reporter programme,media literacy,student journalism,video production ECA,Hong Kong school","status":"published","tags":[],"finalOutcome":"校園新聞、採訪報道或新聞短片","finalOutcomeLabel":"學生成果"},
  {"id":43,"title":"AI動畫製作課程","titleEn":"AI Animation Production Course","description":"運用人工智能工具創作動畫短片，融合創意思維與科技應用，探索AI時代的影像創作新可能。","descriptionEn":"Use artificial intelligence tools to create animated short films, blending creative thinking with technology — exploring the new possibilities of visual storytelling in the AI era.","categoryId":9,"targetGroup":["secondary"],"duration":"6堂（每堂1至2小時）","durationEn":"6 Sessions (1-2 Hours Each)","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-ai-anim-1.jpg","/photo-ai-anim-2.jpg","/photo-ai-anim-3.jpg","/photo-ai-anim-4.jpg"],"featured":false,"slug":"ai-animation-production","seoTitle":"AI Animation Production Course | JuntarHK","seoDescription":"Harness AI to create animated films. JuntarHK's AI Animation Production Course teaches students cutting-edge creative technology in a fun, school-based programme.","seoKeywords":"AI animation course,AI school programme,animation ECA Hong Kong,creative technology school,AI learning students","status":"published","tags":["AI影像創作","AI動畫"],"finalOutcome":"AI動畫短片或原創數碼故事","finalOutcomeLabel":"學生成果"},
  {"id":44,"title":"航拍拍攝課程","titleEn":"Drone Photography Course","description":"學習無人機飛行操作與航拍構圖技巧，掌握空中攝影的法規要求，拍攝震撼人心的俯瞰視角。","descriptionEn":"Learn drone flight operation and aerial composition techniques, understand the regulations for aerial photography, and capture breathtaking bird's-eye perspectives.","categoryId":4,"targetGroup":["secondary"],"duration":"全日","durationEn":"Full Day","minParticipants":10,"maxParticipants":20,"location":"校外","locationEn":"Off Campus","imageUrl":null,"images":["/photo-drone-1.jpg","/photo-drone-2.jpg","/photo-drone-3.jpg","/photo-drone-4.jpg"],"featured":false,"slug":"drone-photography-course","seoTitle":"Drone Photography Course | JuntarHK","seoDescription":"Take creativity to new heights with JuntarHK's Drone Photography Course. Students learn aerial photography and drone operation in a safe, supervised outdoor environment.","seoKeywords":"drone photography,aerial photography course,school drone training,visual media ECA Hong Kong","status":"published","tags":[],"finalOutcome":"航拍影像作品或校園主題短片","finalOutcomeLabel":"學生成果"},
  {"id":45,"title":"攝影療癒課程","titleEn":"Photography Therapy Course","description":"透過攝影觀察日常美好，以鏡頭為媒介進行自我探索與情緒表達，培養正念與感恩的生活態度。","descriptionEn":"Use photography to observe the beauty of everyday life, exploring self-expression and emotional release through the lens — cultivating mindfulness and gratitude.","categoryId":4,"targetGroup":["kindergarten","primary","secondary"],"duration":"半日","durationEn":"Half Day","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":["/photo-healing-1.jpg","/photo-healing-2.jpg","/photo-healing-3.jpg","/photo-healing-4.jpg","/photo-healing-5.jpg","/photo-healing-6.jpg"],"featured":false,"slug":"photography-therapy-course","seoTitle":"Photography Therapy Course | JuntarHK","seoDescription":"Use photography as a tool for emotional expression and wellbeing. JuntarHK's Photography Therapy Course supports student mental health through creative visual storytelling.","seoKeywords":"photography therapy,art therapy school,student wellbeing ECA,mental health Hong Kong school,creative arts","status":"published","tags":[],"finalOutcome":"個人視覺日記或主題攝影作品集","finalOutcomeLabel":"學生成果"},
  {"id":46,"title":"國藝表演及研習","titleEn":"National Arts Performance & Workshop","description":"透過到校表演服務及研習活動，讓學生認識中國傳統藝術的文化歷史，並親身互動體驗，可選中式雜耍、舞獅、書法、武術等多個項目。","descriptionEn":"Through school performances and workshops, students experience the cultural history of traditional Chinese arts — with options including Chinese acrobatics, lion dance, calligraphy, and martial arts.","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":30,"maxParticipants":200,"location":"學校禮堂 / 操場","locationEn":"School Hall / Playground","imageUrl":"/culture/image144.jpeg","images":["/culture/image144.jpeg","/culture/image141.jpeg","/culture/image145.jpeg","/culture/image154.jpeg","/culture/image168.jpeg","/culture/image176.jpeg"],"featured":true,"slug":"national-arts-performance-workshop","seoTitle":"National Arts Performance & Workshop | JuntarHK","seoDescription":"Celebrate Chinese performing arts with JuntarHK's National Arts Performance & Workshop. From dragon dance to martial arts, students experience the richness of Chinese culture.","seoKeywords":"Chinese performing arts school,national arts workshop,dragon dance school,Chinese culture performance,ECA cultural arts","status":"published","tags":[]},
  {"id":47,"title":"拍攝區主題佈置","titleEn":"Themed Photo Zone","description":"各類型主題背景板搭配漢服及道具，讓參加者現場拍照留下精彩紀念照。配有大型背景板、中式道具及手持小道具，提供完整沉浸式打卡體驗。\n\n  【可選主題佈置】\n  • 傳統中式主題（共創城）— 桃花樹、屏風、蔬果籠、中式雨傘\n  • 福字主題 — 龍鼓、銅鑼、巨型新年燈籠、中式雨傘\n  • 生肖主題（2026馬年）— 特別道具：馬仔坐騎、木橋、蔬果竹籠\n  • 食·酒家主題 — 屏風、點心展示層架、餐車、木井\n  • 熊貓主題 — 兩旁竹林、草坪地毯、古代木車、銅鑼\n  • 花燈會主題 — 大量燈籠佈置、中式雨傘\n\n  【漢服體驗加選】\n  • 提供20套不同尺寸漢服，讓學生試穿各朝代傳統服飾並在拍攝區打卡留念","descriptionEn":"Various themed backdrop panels paired with hanfu (traditional Chinese clothing) and props, allowing participants to take memorable photos on the spot. Includes large backdrop panels, Chinese props, and handheld accessories for a fully immersive experience.\n\n【Available Themes】\n• Traditional Chinese Theme — peach blossom tree, screens, vegetable baskets, Chinese umbrellas\n• Fu Character Theme — dragon drums, gongs, giant New Year lanterns, Chinese umbrellas\n• Zodiac Theme (2026 Year of the Horse) — horse rider prop, wooden bridge, bamboo vegetable baskets\n• Food & Restaurant Theme — screens, dim sum display racks, food carts, wooden wells\n• Panda Theme — bamboo groves, grass carpet, ancient wooden cart, gongs\n• Lantern Festival Theme — abundance of lantern decorations, Chinese umbrellas\n\n【Hanfu Experience Add-on】\n• 20 hanfu sets in various sizes for students to try on and take photos in traditional costume","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":200,"location":"學校禮堂 / 操場","locationEn":"School Hall / Playground","imageUrl":"/culture/image122.jpeg","images":["/culture/image122.jpeg","/culture/image131.jpeg","/culture/image101.jpeg","/culture/image52.jpeg","/culture/image130.jpeg","/culture/image53.jpeg"],"featured":false,"slug":"themed-photo-zone","seoTitle":"Themed Chinese Cultural Photo Zone | JuntarHK","seoDescription":"Create unforgettable cultural memories with JuntarHK's Themed Photo Zone, featuring traditional Chinese décor and costumes for school cultural events and fun fairs.","seoKeywords":"cultural photo zone,Chinese theme decoration,school cultural fair,Chinese culture activity,photo booth school","status":"published","tags":[]},
  {"id":48,"title":"傳統手工藝攤位","titleEn":"Traditional Handicraft Booth","description":"中國傳統手工藝體驗攤位，由導師全程指導，讓學生親手製作傳統工藝品，可選剪紙、燈籠、陶泥、刺繡等，感受中華藝術的精妙。","descriptionEn":"Hands-on traditional Chinese craft stations guided by instructors. Students create their own pieces from options including paper cutting, lantern making, pottery, and embroidery.","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":200,"location":"學校禮堂 / 課室","locationEn":"School Hall / Classroom","imageUrl":"/culture/image189.jpeg","images":["/culture/image189.jpeg","/culture/image182.jpeg","/culture/image198.jpeg","/culture/image190.jpeg","/culture/image183.jpeg","/culture/image203.jpeg"],"featured":false,"slug":"traditional-handicraft-booth","seoTitle":"Traditional Chinese Handicraft Booth | JuntarHK","seoDescription":"Celebrate intangible cultural heritage with JuntarHK's Traditional Handicraft Booth. Students try paper folding, weaving and classic crafts in a fun school setting.","seoKeywords":"traditional handicraft,Chinese arts and crafts school,cultural heritage education,craft workshop Hong Kong,intangible cultural heritage","status":"published","tags":[]},
  {"id":49,"title":"古代運動攤位","titleEn":"Ancient Sports Booth","description":"體驗中國古代傳統運動及玩意，由師傅示範及指導，可選扯鈴、陀螺、毽子、投壺等，讓學生感受中華傳統體育文化的趣味與智慧。","descriptionEn":"Experience traditional Chinese sports and games guided by masters. Choose from diabolo, spinning tops, shuttlecock kicking, pot pitching, and more.","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":200,"location":"學校操場 / 禮堂","locationEn":"School Playground / Hall","imageUrl":"/culture/image211.jpeg","images":["/culture/image211.jpeg","/culture/image212.jpeg","/culture/image214.jpeg","/culture/image215.jpeg","/culture/image216.jpeg","/culture/image217.jpeg","/culture/image222.jpeg"],"featured":false,"slug":"ancient-sports-booth","seoTitle":"Ancient Chinese Sports Booth | JuntarHK","seoDescription":"Bring history to life with JuntarHK's Ancient Sports Booth, where students try traditional Chinese sports and games at school cultural fairs and fun days.","seoKeywords":"ancient Chinese sports,traditional games school,Chinese culture ECA,school cultural fair activity,heritage sports","status":"published","tags":[]},
  {"id":50,"title":"傳統美食攤位","titleEn":"Traditional Food Booth","description":"由師傅現場製作中國傳統小食及點心，部分設有體驗製作環節，學生親手參與並即場試食，感受中華飲食文化的獨特魅力。","descriptionEn":"Traditional Chinese snacks and dim sum prepared live by masters, with hands-on making sessions for students to join in and taste what they create.","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":200,"location":"學校禮堂 / 操場","locationEn":"School Hall / Playground","imageUrl":"/culture/image237.jpeg","images":["/culture/image237.jpeg","/culture/image234.jpeg","/culture/image235.jpeg","/culture/image238.jpeg","/culture/image240.jpeg","/culture/image243.jpeg","/culture/image244.jpeg"],"featured":false,"slug":"traditional-food-booth","seoTitle":"Traditional Chinese Food Booth | JuntarHK","seoDescription":"Celebrate Chinese culinary heritage with JuntarHK's Traditional Food Booth. Students explore traditional flavours and food culture in a festive school setting.","seoKeywords":"traditional Chinese food,cultural activity school Hong Kong,Chinese culture ECA,school cultural fair,heritage education","status":"published","tags":[]},
  {"id":51,"title":"古代科技攤位","titleEn":"Ancient Technology Booth","description":"認識中國古代科技成就，透過互動展示及親手體驗，了解中華文明對世界的貢獻，可選仿古青銅樂器、雕版拓印、造紙術、搭棚及中醫體驗。","descriptionEn":"Discover ancient Chinese science and technology through interactive displays. Options include replica bronze instruments, woodblock printing, papermaking, bamboo scaffolding, and TCM experiences.","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":200,"location":"學校禮堂 / 課室","locationEn":"School Hall / Classroom","imageUrl":"/culture/image99.jpeg","images":["/culture/image99.jpeg","/culture/image100.jpeg","/culture/image283.jpeg","/culture/image284.jpeg","/culture/image281.jpeg"],"featured":false,"slug":"ancient-technology-booth","seoTitle":"Ancient Chinese Technology Booth | JuntarHK","seoDescription":"Discover the ingenuity of ancient China with JuntarHK's Ancient Technology Booth. Students experience traditional inventions and engineering through interactive demonstrations.","seoKeywords":"ancient Chinese technology,Chinese culture education,STEM cultural activity,school cultural booth,heritage STEM","status":"published","tags":[]},
  {"id":57,"title":"生涯規劃 - 森林導賞員職業體驗","titleEn":"Career Planning — Forest Guide Experience","description":"由樂然森林學院專業導師帶領，讓孩子親身體驗森林導賞員的工作，在大自然中學習生態知識、訓練演說技巧，啟發對大自然職業的興趣。\n\n【活動內容】\n1. 接觸大自然環境\n2. 學習不同的生態知識（蝴蝶、植物、昆蟲等）\n3. 訓練演說技巧\n4. 體驗導賞員工作\n\n由樂然森林學院 × 知涵兒童財商學院 × Babington Education 聯合呈獻","descriptionEn":"Led by Log In Forest Academy professional instructors, children experience the role of a forest nature guide — learning ecological knowledge, developing presentation skills, and discovering careers in nature.\n\n【Programme Content】\n1. Explore the natural environment\n2. Learn about local ecology (butterflies, plants, insects and more)\n3. Train public speaking and presentation skills\n4. Experience the work of a nature guide\n\nPresented by Log In Forest Academy × Childpreneur Academy (KYCAHK) × Babington Education","categoryId":10,"additionalCategoryIds":[],"targetGroup":["primary"],"duration":"2小時","durationEn":"2 Hours","minParticipants":8,"maxParticipants":25,"location":"獅子會蕉坑自然教育中心 + 蕉坑自然教育徑","locationEn":"Lions Club Jiu Keng Nature Education Centre + Jiu Keng Nature Trail","imageUrl":"/career/forest-guide-1.jpeg","images":["/career/forest-guide-1.jpeg","/career/forest-guide-2.jpeg"],"sortOrder":4,"featured":false,"slug":"forest-guide-career-experience","seoTitle":"森林導賞員職業體驗 | 生涯規劃 | JuntarHK","seoDescription":"親子職業體驗！由專業導師帶領孩子探索森林、學習生態知識，體驗森林導賞員工作。適合6-12歲小朋友及家長。","seoKeywords":"森林導賞員,職業體驗,生涯規劃,自然教育,蕉坑,親子活動香港","status":"published","tags":[]},
  {"id":58,"title":"生涯規劃 - 寵物物理治療師職業體驗","titleEn":"Career Planning — Pet Physiotherapist Experience","description":"由兆和動物理療專業治療師帶領，讓孩子親身體驗寵物物理治療師及寵物理療師的工作。培養同理心與愛心，啟發對動物護理職業的興趣。\n\n【活動目標】\n• 建立同理心及愛心\n• 讓孩子了解自己的興趣與潛能\n• 體驗工作，發掘職業興趣\n• 培養孩子正向價值\n• 提升孩子生活體驗\n\n由知涵兒童財商學院 × 兆和動物理療 × Babington Education 聯合呈獻","descriptionEn":"Led by Harmony Physiotherapy & Healthcare Centre professionals, children experience the roles of pet physiotherapist and animal therapist. The programme nurtures empathy and compassion while exploring careers in animal care.\n\n【Programme Objectives】\n• Develop empathy and compassion\n• Help children discover their interests and potential\n• Experience professional work to uncover career interests\n• Foster positive values\n• Enrich life experience\n\nPresented by Childpreneur Academy (KYCAHK) × Harmony Animal Physiotherapy × Babington Education","categoryId":10,"additionalCategoryIds":[],"targetGroup":["kindergarten","primary","secondary"],"duration":"2小時","durationEn":"2 Hours","minParticipants":8,"maxParticipants":20,"location":"何文田 兆和動物理療","locationEn":"Harmony Animal Physiotherapy, Ho Man Tin","imageUrl":"/career/pet-physio-1.jpeg","images":["/career/pet-physio-1.jpeg","/career/pet-physio-2.jpeg","/career/pet-physio-3.jpeg","/career/pet-physio-4.jpeg"],"sortOrder":6,"featured":false,"slug":"pet-physiotherapist-career-experience","seoTitle":"寵物物理治療師職業體驗 | 生涯規劃 | JuntarHK","seoDescription":"親子職業體驗！讓孩子體驗寵物物理治療師工作，培養同理心與愛心。適合4-14歲小朋友及家長，由兆和動物理療專業導師帶領。","seoKeywords":"寵物物理治療師,職業體驗,生涯規劃,動物護理,親子活動香港,兆和動物理療","status":"published","tags":[]},
  {"id":59,"title":"生涯規劃 - 珠寶設計師職業體驗","titleEn":"Career Planning — Jewellery Designer Experience","description":"由香港資深珠寶首飾設計師 Alvin Au 帶領，讓孩子親身接觸珠寶設計工場，了解珠寶設計師的工作，並動手體驗珠寶設計及製作，親手製作一份精美飾品帶回家。\n\n【活動內容】\n• 接觸珠寶設計及工場\n• 了解珠寶設計師的工作與職涯\n• 體驗珠寶設計及製作過程\n• 每組親子製作一份作品帶回家\n\n由知涵兒童財商學院 × Babington Education 聯合呈獻","descriptionEn":"Led by veteran Hong Kong jewellery designer Alvin Au, children step into a real jewellery design studio, learn about the career of a jewellery designer, and experience hands-on jewellery making — each family takes home their own creation.\n\n【Programme Content】\n• Explore a professional jewellery design workshop\n• Learn about the work and career path of a jewellery designer\n• Experience the jewellery design and making process\n• Each parent-child pair creates and brings home a piece\n\nPresented by Childpreneur Academy (KYCAHK) × Babington Education","categoryId":10,"additionalCategoryIds":[],"targetGroup":["kindergarten","primary"],"duration":"2小時","durationEn":"2 Hours","minParticipants":8,"maxParticipants":20,"location":"觀塘鴻圖道76號聯運工業大廈13樓B室","locationEn":"13/F Block B, Luen Fat Industrial Building, 76 Hung To Road, Kwun Tong","imageUrl":"/career/jewellery-designer-1.jpeg","images":["/career/jewellery-designer-1.jpeg","/career/jewellery-designer-2.jpeg"],"sortOrder":5,"featured":false,"slug":"jewellery-designer-career-experience","seoTitle":"珠寶設計師職業體驗 | 生涯規劃 | JuntarHK","seoDescription":"親子職業體驗！由資深珠寶設計師 Alvin Au 帶領，讓孩子接觸珠寶設計工場，動手製作屬於自己的飾品。適合5-12歲小朋友及家長。","seoKeywords":"珠寶設計師,職業體驗,生涯規劃,珠寶製作,親子活動香港,觀塘","status":"published","tags":[]},
  {"id":60,"title":"AI 思維與溝通課","titleEn":"AI Thinking & Communication Course","description":"透過互動任務學習如何向AI提出清晰問題、比較及修改生成結果，並建立基本資料查證、安全及使用倫理意識。","descriptionEn":"Students learn to ask clear questions to AI, compare and refine generated outputs, and build foundational awareness of fact-checking, safety, and responsible AI use.","categoryId":9,"additionalCategoryIds":[],"targetGroup":["primary"],"duration":"6 堂，每堂 1 小時","durationEn":"6 Sessions × 1 Hour Each","minParticipants":10,"maxParticipants":30,"location":"學校課室","locationEn":"School Classroom","imageUrl":"/ai/ai-thinking-communication-poster.png","images":["/ai/ai-thinking-communication-poster.png"],"featured":false,"slug":"ai-thinking-communication-course","seoTitle":"AI 思維與溝通課 | AI 到校課程 | JuntarHK","seoDescription":"專為小一至小六學生而設的AI訓練班，6堂互動課程教導孩子掌握提示詞、批判性思考及AI資訊素養，真正成為AI的主人。到校課程，由知涵兒童財商學院主辦。","seoKeywords":"AI課程,人工智能教育,提示詞訓練,AI思考,到校課程,小學AI教育香港,ChatGPT小學","status":"published","tags":["AI素養","資料查證"],"finalOutcome":"AI學習作品集及個人提示詞練習紀錄","finalOutcomeLabel":"學生成果"},
  {"id":55,"title":"iMoney系統化財商課程 (儲蓄&消費)","titleEn":"iMoney Systematic Financial Literacy Course (Saving & Spending)","description":"由淺入深認識金錢相關知識，建立財務思維。以遊戲式學習為核心，讓孩子在互動體驗中掌握儲蓄與消費的智慧。\n\n【課程重點】\n• 認識金錢的概念與功能\n• 了解儲蓄的重要性及方法\n• 學習分辨「需要」與「想要」\n• 建立健康的消費習慣與決策思維\n\n導師：知涵兒童財商學院導師團隊","descriptionEn":"A structured programme that builds financial knowledge from the ground up, developing a money mindset through game-based learning. Children gain practical wisdom around saving and spending through interactive experiences.\n\n【Programme Highlights】\n• Understand the concept and functions of money\n• Learn the importance of saving and practical saving strategies\n• Distinguish between 'needs' and 'wants'\n• Build healthy spending habits and decision-making skills\n\nInstructor: Childpreneur Academy (KYCAHK) instructor team","categoryId":10,"additionalCategoryIds":[],"targetGroup":["kindergarten","primary"],"duration":"1.5-2小時","durationEn":"1.5-2 Hours","minParticipants":15,"maxParticipants":40,"location":"學校課室","locationEn":"School Classroom","imageUrl":"/financial/imoney-save-spend-1.jpeg","images":["/financial/imoney-save-spend-1.jpeg","/financial/imoney-income-invest-2.jpeg"],"sortOrder":0,"featured":false,"slug":"imoney-saving-spending","seoTitle":"iMoney財商課程 (儲蓄&消費) | JuntarHK","seoDescription":"遊戲式兒童財商教育課程，由淺入深認識儲蓄與消費。適合幼稚園至小學，幫助孩子建立健康金錢觀。","seoKeywords":"兒童財商,儲蓄教育,消費教育,iMoney,到校課程,小學財商","status":"published","tags":[]},
  {"id":56,"title":"iMoney系統化財商課程 (收入&投資)","titleEn":"iMoney Systematic Financial Literacy Course (Income & Investment)","description":"由淺入深認識金錢相關知識，建立財務思維。以遊戲式學習為核心，讓孩子在互動體驗中掌握收入與投資的概念，為未來財務規劃打好基礎。\n\n【課程重點】\n• 認識不同收入來源及工作與報酬的關係\n• 了解投資的基本概念與風險意識\n• 學習如何讓金錢為自己工作\n• 建立長遠財務規劃思維\n\n導師：知涵兒童財商學院導師團隊","descriptionEn":"A structured programme that builds financial knowledge progressively, developing a money mindset through game-based learning. Children explore income and investment concepts through interactive experiences, laying a foundation for lifelong financial planning.\n\n【Programme Highlights】\n• Understand different income sources and the relationship between work and reward\n• Learn the basics of investment and risk awareness\n• Discover how to make money work for you\n• Build a long-term financial planning mindset\n\nInstructor: Childpreneur Academy (KYCAHK) instructor team","categoryId":10,"additionalCategoryIds":[],"targetGroup":["primary","secondary"],"duration":"1.5-2小時","durationEn":"1.5-2 Hours","minParticipants":15,"maxParticipants":40,"location":"學校課室","locationEn":"School Classroom","imageUrl":"/financial/imoney-income-invest-1.jpeg","images":["/financial/imoney-income-invest-1.jpeg"],"sortOrder":1,"featured":false,"slug":"imoney-income-investment","seoTitle":"iMoney財商課程 (收入&投資) | JuntarHK","seoDescription":"遊戲式兒童財商教育課程，由淺入深認識收入與投資。適合小學至中學，幫助孩子建立理財智慧與長遠規劃思維。","seoKeywords":"兒童財商,投資教育,收入教育,iMoney,到校課程,小學財商,中學財商","status":"published","tags":[]},
  {"id":54,"title":"到校財商體驗日","titleEn":"School Financial Literacy Experience Day","description":"專為全方位活動日、家長日或 STEAM 日而設。透過財商桌遊體驗及職業體驗，讓孩子在輕鬆遊戲中認識金錢智慧，生動互動、寓學於樂。\n\n【活動特點】\n• 靈活時間安排（1.5–3 小時）\n• 財商桌遊體驗 — 以桌遊形式學習儲蓄、理財及消費決策\n• 職業體驗 — 模擬不同職業角色，體驗賺錢與花費的真實感受\n\n導師：知涵兒童財商學院導師團隊","descriptionEn":"Designed for whole-school activity days, parent days, or STEAM days. Through financial literacy board games and career experience simulations, children discover money wisdom in a fun and interactive setting — learning through play.\n\n【Programme Highlights】\n• Flexible scheduling (1.5–3 hours)\n• Financial Literacy Board Games — learn about saving, budgeting, and spending decisions through gameplay\n• Career Experience — role-play different professions to experience earning and spending in a realistic context\n\nInstructor: Childpreneur Academy (KYCAHK) instructor team","categoryId":10,"additionalCategoryIds":[],"targetGroup":["kindergarten","primary","secondary"],"duration":"1.5-3小時","durationEn":"1.5-3 Hours","minParticipants":20,"maxParticipants":150,"location":"學校課室 / 禮堂","locationEn":"School Classroom / Hall","imageUrl":"/financial/school-financial-exp-4.jpeg","images":["/financial/school-financial-exp-4.jpeg","/financial/school-financial-exp-2.jpeg","/financial/school-financial-exp-3.jpeg"],"sortOrder":2,"featured":false,"slug":"school-financial-literacy-experience-day","seoTitle":"到校財商體驗日 | JuntarHK","seoDescription":"為小學生而設的到校財商體驗日，透過桌遊及職業體驗，讓孩子在遊戲中學習金融智慧。適合全方位活動日、家長日及 STEAM 日。","seoKeywords":"財商教育,兒童理財,到校活動,STEAM日,全方位活動日,桌遊教育","status":"published","tags":[]},
  {"id":53,"title":"【秦】錢傳奇","titleEn":"[Qin] The Money Legend","description":"中國貨幣歷史探索日，入校中華文化推廣計劃。主題：秦始皇統一貨幣。\n\n目的：\n• 讓學生了解中國貨幣的歷史演變及現代貨幣的發展\n• 讓學生認識秦始皇統一貨幣的重要性及其對中國經濟的影響\n• 提升學生對中國文化的認識及興趣\n\n導師：知涵兒童財商學院導師團隊","descriptionEn":"Chinese Currency History Exploration Day — a school-based Chinese cultural promotion programme. Theme: Qin Shi Huang Unifies Currency.\n\nObjectives:\n• Help students understand the historical evolution of Chinese currency and the development of modern money\n• Enable students to appreciate the significance of Qin Shi Huang's currency unification and its impact on China's economy\n• Deepen students' knowledge of and interest in Chinese culture\n\nInstructor: Childpreneur Academy (KYCAHK) instructor team","categoryId":10,"additionalCategoryIds":[3],"targetGroup":["primary"],"duration":"1.5-2小時","durationEn":"1.5-2 Hours","minParticipants":20,"maxParticipants":30,"location":"學校課室","locationEn":"School Classroom","imageUrl":"/qin-money-legend-poster.png","images":["/qin-money-legend-poster.png"],"sortOrder":3,"featured":false,"slug":"qin-money-legend","seoTitle":"【秦】錢傳奇 — 中國貨幣歷史探索日 | JuntarHK","seoDescription":"帶學生穿越歷史，認識秦始皇統一貨幣的故事。JuntarHK 與知涵兒童財商學院合辦，適合小四至小六的入校中華文化推廣課程。","seoKeywords":"中國貨幣歷史,秦始皇,財商教育,中華文化活動,入校課程,小學ECA","status":"published","tags":[]},
  {"id":52,"title":"遊戲攤位","titleEn":"Traditional Games Booth","description":"結合中華文化主題的趣味互動遊戲，適合學生自由參與，寓教於樂，可選主題對對碰、文化問答、書法挑戰、傳統棋類等多個項目。","descriptionEn":"Fun, culture-themed interactive games for students to join freely. Options include matching card games, cultural trivia, calligraphy challenges, and traditional board games.","categoryId":3,"targetGroup":["kindergarten","primary","secondary"],"duration":"半天至全天","durationEn":"Half Day to Full Day","minParticipants":20,"maxParticipants":200,"location":"學校禮堂 / 操場","locationEn":"School Hall / Playground","imageUrl":"/culture/image289.jpeg","images":["/culture/image289.jpeg","/culture/image290.jpeg","/culture/image102.jpeg","/culture/image104.jpeg","/culture/image291.jpeg","/culture/image293.jpeg"],"featured":false,"slug":"traditional-games-booth","seoTitle":"Traditional Chinese Games Booth | JuntarHK","seoDescription":"Fun meets culture! JuntarHK's Traditional Games Booth brings classic Chinese folk games to school events, encouraging cultural appreciation and friendly competition.","seoKeywords":"traditional Chinese games,folk games school,cultural activity Hong Kong,school fun fair game,Chinese heritage games","status":"published","tags":[]},
  {"id":61,"title":"AI圖像及視覺故事創作","titleEn":"AI Image and Visual Storytelling","description":"學生由故事主題、角色及場景開始，學習以AI協助創作圖像，再透過選擇、修改及排版完成個人視覺故事。","descriptionEn":"Students start with story themes, characters and settings, then learn to create images with AI assistance, selecting and arranging them into a personal visual narrative.","categoryId":9,"targetGroup":["primary","secondary"],"duration":"4–6節，每節60–90分鐘","durationEn":"4–6 sessions, 60–90 min each","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":[],"featured":false,"status":"published","tags":["AI影像創作","視覺故事"],"finalOutcome":"四格漫畫、故事繪本或主題圖像作品集","finalOutcomeLabel":"學生成果","slug":"ai-image-visual-storytelling","seoTitle":"AI圖像及視覺故事創作課程 | JuntarHK","seoDescription":"學生以AI工具創作圖像，完成個人視覺故事——四格漫畫、故事繪本或主題圖像作品集。","seoKeywords":"AI視覺故事,AI圖像創作,AI動畫課程香港,學生AI課程"},
  {"id":62,"title":"AI短片及數碼敘事","titleEn":"AI Video and Digital Storytelling","description":"結合傳統影片製作與AI工具，讓學生由資料搜集、腳本、分鏡到影像及聲音製作，完成一段主題短片。","descriptionEn":"Combining traditional filmmaking with AI tools, students go from research and scripting through storyboarding to image and audio production, completing a themed short film.","categoryId":9,"targetGroup":["secondary"],"duration":"6–10節，每節60–120分鐘","durationEn":"6–10 sessions, 60–120 min each","minParticipants":10,"maxParticipants":25,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":[],"featured":false,"status":"published","tags":["AI影像創作","影片製作"],"finalOutcome":"AI輔助校園短片、紀錄短片或專題影片","finalOutcomeLabel":"學生成果","slug":"ai-video-digital-storytelling","seoTitle":"AI短片及數碼敘事課程 | JuntarHK","seoDescription":"結合AI工具與傳統影片製作，學生完成AI輔助校園短片、紀錄短片或專題影片。","seoKeywords":"AI短片課程,AI影片製作,數碼敘事,中學AI課程香港"},
  {"id":63,"title":"AI＋中華文化及中國歷史","titleEn":"AI, Chinese Culture and Chinese History","description":"學生以中華文化或中國歷史為主題，進行資料搜集及查證，再運用AI圖像、動畫及敘事工具完成跨學科作品。","descriptionEn":"Students choose a Chinese culture or history theme, research and fact-check their content, then use AI image, animation and storytelling tools to complete a cross-curricular project.","categoryId":9,"targetGroup":["primary","secondary"],"duration":"4–8節，每節60–90分鐘","durationEn":"4–8 sessions, 60–90 min each","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":[],"featured":false,"status":"published","tags":["AI＋學科","中華文化","中國歷史"],"finalOutcome":"中華文化數碼故事、中國歷史動畫或主題展覽作品","finalOutcomeLabel":"學生成果","slug":"ai-chinese-culture-digital-story","seoTitle":"AI＋中華文化及中國歷史課程 | JuntarHK","seoDescription":"以中華文化或中國歷史為主題，結合AI工具完成跨學科數碼故事、動畫或展覽作品。","seoKeywords":"AI中華文化課程,AI中國歷史,跨學科AI,中小學AI課程香港"},
  {"id":64,"title":"AI媒體素養及事實查核","titleEn":"AI Media Literacy and Fact-checking","description":"透過真假內容比較、來源追查及生成內容分析，培養學生辨識錯誤資訊、深度偽造及AI偏見的能力。","descriptionEn":"Through real-versus-fake content comparisons, source tracing, and generated content analysis, students develop skills to identify misinformation, deepfakes, and AI bias.","categoryId":9,"targetGroup":["primary","secondary"],"duration":"3–6節，每節60–90分鐘","durationEn":"3–6 sessions, 60–90 min each","minParticipants":10,"maxParticipants":30,"location":"校園","locationEn":"School Campus","imageUrl":null,"images":[],"featured":false,"status":"published","tags":["AI媒體素養","資料查證"],"finalOutcome":"事實查核報告、媒體分析簡報或校園資訊素養指南","finalOutcomeLabel":"學生成果","slug":"ai-media-literacy-fact-checking","seoTitle":"AI媒體素養及事實查核課程 | JuntarHK","seoDescription":"培養學生辨識錯誤資訊及深度偽造的批判思維，完成事實查核報告或媒體分析簡報。","seoKeywords":"AI媒體素養,事實查核,深度偽造,批判思考,中小學AI課程香港"},
  {"id":65,"title":"教師AI教材及行政工作流","titleEn":"AI Teaching Materials and Administrative Workflow","description":"協助教師運用AI整理資料、設計教材、製作簡報及改善日常行政流程，同時建立查證、私隱及使用邊界。","descriptionEn":"Helps teachers use AI to organise information, design teaching materials, create presentations and streamline administrative workflows, while establishing clear boundaries for verification, privacy and responsible use.","categoryId":9,"targetGroup":["secondary"],"duration":"1–3節，每節90–180分鐘","durationEn":"1–3 sessions, 90–180 min each","minParticipants":5,"maxParticipants":30,"location":"學校","locationEn":"School","imageUrl":null,"images":[],"featured":false,"status":"published","tags":["教師培訓","教材製作"],"finalOutcome":"教材範本、簡報、活動文件及可重用AI工作流程","finalOutcomeLabel":"培訓成果","slug":"ai-teacher-workflow","seoTitle":"教師AI教材及行政工作流培訓 | JuntarHK","seoDescription":"協助教師以AI提升工作效率——設計教材、製作簡報、優化行政流程，並掌握AI使用原則。","seoKeywords":"教師AI培訓,AI教材設計,AI行政工作流,學校AI培訓香港"}
];



export async function seedIfEmpty() {
  for (const cat of SEED_CATEGORIES) {
    await db.insert(categoriesTable)
      .values(cat as any)
      .onConflictDoUpdate({
        target: categoriesTable.id,
        set: {
          slug: sql`EXCLUDED.slug`,
          name: sql`EXCLUDED.name`,
          nameEn: sql`EXCLUDED.name_en`,
          icon: sql`EXCLUDED.icon`,
          color: sql`EXCLUDED.color`,
        },
      });
  }

  let synced = 0;
  for (const act of SEED_ACTIVITIES) {
    try {
      const raw = act as any;
      const targetGroup: string[] = Array.isArray(raw.targetGroup)
        ? raw.targetGroup
        : typeof raw.targetGroup === "string"
          ? raw.targetGroup.split(",").map((s: string) => s.trim())
          : ["kindergarten", "primary", "secondary"];
      const additionalCategoryIds: number[] = Array.isArray(raw.additionalCategoryIds)
        ? raw.additionalCategoryIds
        : [];
      await db
        .insert(activitiesTable)
        .values({ ...raw, targetGroup, additionalCategoryIds })
        .onConflictDoUpdate({
          target: activitiesTable.id,
          set: {
            slug: sql`EXCLUDED.slug`,
            title: sql`EXCLUDED.title`,
            titleEn: sql`EXCLUDED.title_en`,
            descriptionEn: sql`EXCLUDED.description_en`,
            durationEn: sql`EXCLUDED.duration_en`,
            locationEn: sql`EXCLUDED.location_en`,
            seoTitle: sql`EXCLUDED.seo_title`,
            seoDescription: sql`EXCLUDED.seo_description`,
            seoKeywords: sql`EXCLUDED.seo_keywords`,
            targetGroup: sql`EXCLUDED.target_group`,
            additionalCategoryIds: sql`EXCLUDED.additional_category_ids`,
            images: sql`EXCLUDED.images`,
            imageUrl: sql`EXCLUDED.image_url`,
            featured: sql`EXCLUDED.featured`,
            categoryId: sql`EXCLUDED.category_id`,
            sortOrder: sql`EXCLUDED.sort_order`,
            status: sql`EXCLUDED.status`,
          },
        });
      synced++;
    } catch (e) {
      console.error(`[seed] Failed activity id=${(act as any).id}:`, e);
    }
  }
  console.log("[seed] Activities synced:", synced, "/", SEED_ACTIVITIES.length);
  console.log("[seed] Categories synced:", SEED_CATEGORIES.length);
}

/**
 * Idempotent patch: reconciles the `tags` column in the DB against the
 * canonical PROGRAMME_TAGS map from @workspace/programmes-data (the single
 * source of truth shared with the activity-platform frontend).
 *
 * MAINTENANCE: to add or rename a tag, edit lib/programmes-data/src/index.ts
 * only.  This function derives everything from that file — no copy to keep in
 * sync here.  Only the `tags` column is touched; all other curated fields are
 * left untouched.
 *
 * Safe to run on every startup — it is a no-op when the DB already matches.
 *
 * Returns { updated, skipped, failed } where `failed` lists any slugs whose
 * DB update threw an error.  Callers should treat a non-empty `failed` list as
 * an error condition.
 */
export async function patchProgrammeTags(): Promise<{
  updated: number;
  skipped: number;
  failed: string[];
}> {
  // Import directly from the shared source — if this import fails to resolve,
  // the build breaks, making it impossible for the data to silently drift.
  const { PROGRAMME_TAGS } = await import("@workspace/programmes-data");

  let updated = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const [slug, desiredTags] of Object.entries(PROGRAMME_TAGS)) {
    try {
      // Compare using array_to_json so both sides use the same JSON format.
      // tags is a text[] column; tags::text gives PostgreSQL {a,b} notation,
      // not JSON, so we must use array_to_json(tags)::text for the comparison.
      const desiredJson = JSON.stringify(desiredTags);
      const result = await db
        .update(activitiesTable)
        .set({ tags: desiredTags })
        .where(
          sql`slug = ${slug} AND (tags IS NULL OR array_to_json(tags)::text != ${desiredJson})`
        )
        .returning({ id: activitiesTable.id, slug: activitiesTable.slug });

      if (result.length > 0) {
        console.log(`[patchProgrammeTags] Updated tags for slug="${slug}" → ${desiredJson}`);
        updated++;
      } else {
        skipped++;
      }
    } catch (e) {
      console.error(`[patchProgrammeTags] Failed for slug="${slug}":`, e);
      failed.push(slug);
    }
  }

  if (failed.length > 0) {
    console.error(
      `[patchProgrammeTags] ${failed.length} slug(s) failed to update: ${failed.join(", ")}`
    );
  } else {
    console.log(
      `[patchProgrammeTags] Done — ${updated} row(s) updated, ${skipped} already in sync.`
    );
  }

  return { updated, skipped, failed };
}

/**
 * Idempotent patch: renames activity slugs to align with programme-data slugs
 * so that /activities/:slug routes resolve to the correct rich detail pages.
 * Safe to run on every startup — uses WHERE slug != new_slug to no-op once done.
 */
export async function patchActivitySlugs() {
  const slugPatches: { id: number; newSlug: string }[] = [
    { id: 38, newSlug: "mobile-photography-video" },
    { id: 42, newSlug: "campus-reporter-tv" },
    { id: 43, newSlug: "ai-animation-production" },
    { id: 63, newSlug: "ai-chinese-culture-digital-story" },
  ];

  let patched = 0;
  for (const { id, newSlug } of slugPatches) {
    try {
      await db
        .update(activitiesTable)
        .set({ slug: newSlug })
        .where(sql`id = ${id} AND slug != ${newSlug}`);
      patched++;
    } catch (e) {
      console.error(`[patch] Failed to update slug for activity id=${id}:`, e);
    }
  }
  console.log(`[patch] Activity slug patch complete (${patched} rows processed).`);
}

/**
 * Idempotent patch: ensures single-photo activities have the full gallery
 * images[] array.  Safe to run on every startup — it is a no-op once the
 * images column already contains the correct array.
 */
export async function patchActivityGalleries() {
  const patches: { id: number; images: string[] }[] = [
    {
      id: 14,
      images: ["/sensory-1.jpg", "/sensory-2.jpg", "/sensory-3.jpg"],
    },
    {
      id: 25,
      images: ["/ecology-1.jpg", "/ecology-2.jpg", "/ecology-3.jpg"],
    },
    {
      id: 39,
      images: ["/photo-video-prod-1.jpg", "/photo-video-prod-2.jpg", "/photo-video-prod-3.jpg"],
    },
    {
      id: 40,
      images: ["/photo-social-media-1.jpg", "/photo-social-media-2.jpg", "/photo-social-media-3.jpg"],
    },
    {
      id: 42,
      images: ["/photo-journalist-1.jpg", "/photo-journalist-2.jpg", "/photo-journalist-3.jpg"],
    },
  ];

  let patched = 0;
  for (const { id, images } of patches) {
    try {
      const imagesJson = JSON.stringify(images);
      await db
        .update(activitiesTable)
        .set({ images })
        .where(sql`id = ${id} AND (images IS NULL OR images::text != ${imagesJson}::jsonb::text)`);
      patched++;
    } catch (e) {
      console.error(`[patch] Failed to update gallery for activity id=${id}:`, e);
    }
  }
  console.log(`[patch] Activity gallery patch complete (${patched} rows processed).`);
}

/**
 * One-time idempotent patch: sets the correct image_url for AI activities
 * that were missing images or had a placeholder.  Safe to run on every
 * startup — it is a no-op once the URLs are already correct.
 */
export async function patchActivityImages() {
  const patches: { id: number; imageUrl: string }[] = [
    // Outdoor Activities (category 1)
    { id: 1,  imageUrl: "/camping-1.jpg" },
    { id: 2,  imageUrl: "/climbing-1.jpg" },
    { id: 3,  imageUrl: "/kayak-1.jpg" },
    { id: 26, imageUrl: "/cooking-1.jpg" },
    { id: 27, imageUrl: "/survival-1.jpg" },
    { id: 29, imageUrl: "/orienteering-1.jpg" },
    // Emerging Sports (category 2)
    { id: 16, imageUrl: "/campus-sports-1.jpg" },
    { id: 17, imageUrl: "/ballsports-1.jpg" },
    { id: 18, imageUrl: "/throwing-1.jpg" },
    { id: 19, imageUrl: "/competitive-1.jpg" },
    { id: 31, imageUrl: "/f1-1.jpg" },
    // Chinese Cultural (category 3)
    { id: 28, imageUrl: "/bamboo-1.jpg" },
    // Photography & School Media (category 4)
    { id: 37, imageUrl: "/photo-basic-1.jpg" },
    { id: 38, imageUrl: "/photo-mobile-1.jpg" },
    { id: 39, imageUrl: "/photo-video-prod-1.jpg" },
    { id: 40, imageUrl: "/photo-social-media-1.jpg" },
    { id: 41, imageUrl: "/photo-sports-1.jpg" },
    { id: 42, imageUrl: "/photo-journalist-1.jpg" },
    { id: 44, imageUrl: "/photo-drone-1.jpg" },
    { id: 45, imageUrl: "/photo-healing-1.jpg" },
    // Ecology Exploration (category 6)
    { id: 13, imageUrl: "/farm-1.jpg" },
    { id: 14, imageUrl: "/sensory-1.jpg" },
    { id: 15, imageUrl: "/mangrove-1.jpg" },
    { id: 25, imageUrl: "/ecology-1.jpg" },
    { id: 36, imageUrl: "/forest-1.jpg" },
    // Adventure Training (category 7)
    { id: 20, imageUrl: "/bouldering-1.jpg" },
    { id: 21, imageUrl: "/campus-1.jpg" },
    { id: 22, imageUrl: "/rope-1.jpg" },
    { id: 23, imageUrl: "/leadership-1.jpg" },
    { id: 30, imageUrl: "/beacon-1.jpg" },
    { id: 32, imageUrl: "/wargame-1.jpg" },
    // AI Education & Creation (category 9)
    { id: 43, imageUrl: "/ai/ai-animation.jpg" },
    { id: 60, imageUrl: "/ai/ai-thinking-01.jpg" },
    { id: 61, imageUrl: "/ai/ai-visual-storytelling.jpg" },
    { id: 62, imageUrl: "/ai/ai-short-film.jpg" },
    { id: 63, imageUrl: "/ai/ai-chinese-culture.jpg" },
    { id: 64, imageUrl: "/ai/ai-media-literacy.jpg" },
    { id: 65, imageUrl: "/ai/ai-teacher-training.jpg" },
  ];

  let patched = 0;
  for (const { id, imageUrl } of patches) {
    try {
      await db
        .update(activitiesTable)
        .set({ imageUrl })
        .where(sql`id = ${id} AND (image_url IS NULL OR image_url != ${imageUrl})`);
      patched++;
    } catch (e) {
      console.error(`[patch] Failed to update image for activity id=${id}:`, e);
    }
  }
  console.log(`[patch] Activity image patch complete (${patched} rows processed).`);
}
