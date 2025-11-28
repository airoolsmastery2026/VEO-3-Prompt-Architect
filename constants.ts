
import { CharacterBible, ProjectSettings, AspectRatio, CinematicStyle, FullProjectData } from './types';

export const DEFAULT_BIBLE: CharacterBible = {
  english: `Captain Nemo, a mysterious and commanding figure in his late forties, with broad shoulders, wearing a dark blue officer's uniform adorned with brass buttons and golden embroidery of mythical sea creatures. His swept-back dark hair with silver streaks and piercing blue eyes show wisdom and hidden sorrow. His posture is always proud and resolute.

Sophia, a young marine scientist in her late twenties, with curly chestnut hair tied in a loose bun, green eyes full of curiosity. She wears a waterproof light jacket over a white shirt and rugged cargo pants, holding a digital tablet and underwater sensors, always focused and alert.`,
  vietnamese: `Thuyền trưởng Nemo, người đàn ông bí ẩn quyền uy khoảng ngoài bốn mươi tuổi, bờ vai rộng, khoác quân phục xanh đậm với các nút đồng và thêu hình sinh vật biển màu vàng. Mái tóc đen vuốt gọn, có vệt bạc, mắt xanh sâu thẳm toát lên vẻ thông thái và u hoài. Dáng đứng nghiêm nghị, kiên cường.

Sophia, nhà khoa học trẻ về biển khoảng cuối hai mươi tuổi, tóc nâu xoăn buộc thành búi lỏng, mắt xanh lá đầy tò mò. Cô mặc áo khoác chống nước ngoài áo sơ mi trắng, quần cargo bụi bặm, tay cầm máy tính bảng và bộ cảm biến dưới nước, nét mặt chăm chú và tập trung.`
};

export const DEFAULT_SETTINGS: ProjectSettings = {
  title: "The Silent Depth",
  context: "Sâu dưới Thái Bình Dương, bên trong tàu ngầm Nautilus công nghệ hơi nước cổ điển nhưng tiên tiến, với ánh sáng tối, mờ ảo và chi tiết kim loại đồng.",
  videoIdea: "Khám phá một cổ vật phát sáng bị lãng quên dưới đáy biển sâu, dẫn đến một khoảnh khắc đối đầu căng thẳng và kịch tính.",
  script: "", 
  style: CinematicStyle.SciFi,
  ratio: AspectRatio.Ratio_16_9,
  sceneCount: 3
};

export const TOY_PROJECT_DATA: FullProjectData = {
  settings: {
    title: "The Magic Cake",
    context: "A miniature toy world, cheerful and bright, with clear sunny sky.",
    videoIdea: "Toy boots discover magic ingredients and bake a rainbow cake.",
    script: "",
    style: CinematicStyle.StopMotion,
    ratio: AspectRatio.Ratio_16_9,
    sceneCount: 25
  },
  characterBible: {
    english: "Toy Boots: A pair of orange toy boots that move autonomously, expressing emotion through hops and bounces.\nCat Statue: A small toy cat statue, usually sleeping.",
    vietnamese: "Ủng đồ chơi: Một đôi ủng nhựa màu cam có thể tự di chuyển, nhảy nhót.\nTượng Mèo: Một bức tượng mèo đồ chơi nhỏ, thường nằm ngủ."
  },
  scenes: [
    {
      id: "toy_1", number: 1,
      descriptionEn: "Objects: A miniature toy playground with a slide and a fence. A pair of toy orange boots and a tennis ball. A small toy cat statue.\nAtmosphere: Cheerful and bright, with a clear, sunny sky.\nSFX: The light, rhythmic 'pat-pat' of the boots as they bounce. A tiny, magical 'ting' sound.",
      descriptionVi: "Đối tượng: Sân chơi đồ chơi thu nhỏ. Đôi ủng cam và bóng tennis. Tượng mèo nhỏ.\nKhông khí: Vui vẻ, sáng sủa.",
      action: "The boots are bouncing happily, playing with the tennis ball. The tiny toy cat statue is sleeping peacefully. The boots suddenly stop, turning towards a strange glow.",
      camera: "Medium shot, eye-level",
      lighting: "Soft, warm lighting",
      transition: "Cut To"
    },
    {
      id: "toy_2", number: 2,
      descriptionEn: "Objects: The toy boots. Three floating plastic toy boxes in red, green, and blue, each with a secure lid.\nAtmosphere: The vibrant, sunny playground is now partially obscured by whimsical smoke, creating a mysterious contrast.\nSFX: A soft 'whoosh' of the smoke. A gentle 'plop-plop-plop' as the boxes land.",
      descriptionVi: "Đối tượng: Đôi ủng. Ba hộp nhựa bay màu đỏ, xanh lá, xanh dương.\nKhông khí: Huyền bí, khói màu.",
      action: "A swirling cloud of rainbow-colored smoke appears. The boots move back in surprise. The three plastic toy boxes emerge from the smoke and land softly.",
      camera: "Medium shot, slightly low-angle",
      lighting: "Playful and dramatic",
      transition: "Cut To"
    },
    {
      id: "toy_3", number: 3,
      descriptionEn: "Objects: The toy boots. The three plastic toy boxes (red, green, and blue).\nAtmosphere: Tense but curious.\nSFX: A small 'tap' sound as the boot touches the box. A light, questioning 'hum' from the boots.",
      descriptionVi: "Đối tượng: Đôi ủng và 3 hộp nhựa.\nKhông khí: Căng thẳng nhưng tò mò.",
      action: "The boots approach cautiously. A single boot pokes the red plastic box to see what's inside.",
      camera: "Close-up on boots and boxes",
      lighting: "Suspenseful",
      transition: "Cut To"
    },
    {
      id: "toy_4", number: 4,
      descriptionEn: "Objects: The red plastic box and a miniature pink toy hairdryer inside.\nAtmosphere: Magical and exciting.\nSFX: A twinkling sound.",
      descriptionVi: "Đối tượng: Hộp đỏ và máy sấy tóc đồ chơi màu hồng bên trong.\nKhông khí: Phép thuật.",
      action: "The lid of the red plastic box slowly opens, revealing a shiny pink toy hairdryer. A small glitter effect sparkles around it.",
      camera: "Extreme close-up on box. Macro lens.",
      lighting: "Sparkling reveal",
      transition: "Cut To"
    }
    // ... Truncated for brevity in default load, but structure demonstrates the point
  ]
};
