import { CharacterBible, ProjectSettings, AspectRatio, CinematicStyle } from './types';

export const DEFAULT_BIBLE: CharacterBible = {
  english: `Captain Nemo, a mysterious and commanding figure in his late forties, with broad shoulders, wearing a dark blue officer's uniform adorned with brass buttons and golden embroidery of mythical sea creatures. His swept-back dark hair with silver streaks and piercing blue eyes show wisdom and hidden sorrow. His posture is always proud and resolute.

Sophia, a young marine scientist in her late twenties, with curly chestnut hair tied in a loose bun, green eyes full of curiosity. She wears a waterproof light jacket over a white shirt and rugged cargo pants, holding a digital tablet and underwater sensors, always focused and alert.`,
  vietnamese: `Thuyền trưởng Nemo, người đàn ông bí ẩn quyền uy khoảng ngoài bốn mươi tuổi, bờ vai rộng, khoác quân phục xanh đậm với các nút đồng và thêu hình sinh vật biển màu vàng. Mái tóc đen vuốt gọn, có vệt bạc, mắt xanh sâu thẳm toát lên vẻ thông thái và u hoài. Dáng đứng nghiêm nghị, kiên cường.

Sophia, nhà khoa học trẻ về biển khoảng cuối hai mươi tuổi, tóc nâu xoăn buộc thành búi lỏng, mắt xanh lá đầy tò mò. Cô mặc áo khoác chống nước ngoài áo sơ mi trắng, quần cargo bụi bặm, tay cầm máy tính bảng và bộ cảm biến dưới nước, nét mặt chăm chú và tập trung.`
};

export const DEFAULT_SETTINGS: ProjectSettings = {
  context: "Deep ocean exploration inside the steampunk submarine Nautilus, featuring advanced yet vintage brass technology and dim, atmospheric lighting.",
  videoIdea: "Captain Nemo discovers an ancient glowing artifact hidden in a craggy, bioluminescent coral reef. Sophia analyzes it, realizing it's sending a signal. A moment of tense discovery.",
  style: CinematicStyle.Cinematic,
  ratio: AspectRatio.Ratio_16_9,
  sceneCount: 3
};

export const SAMPLE_SCENE_IDS = ['s_1', 's_2', 's_3'];
