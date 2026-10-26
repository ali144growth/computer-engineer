import { Project } from './portfolio-data';

export interface StoredProject extends Project {
  createdAt?: string; // ISO date string for sorting newest first
}

export const INITIAL_PROJECTS: StoredProject[] = [
  {
    id: 'fpga-riscv-processor',
    title: {
      en: 'Pipelined RISC-V 32I Core on FPGA',
      ar: 'معالج RISC-V 32I خماسي المراحل على FPGA',
    },
    image: '/images/smart-lock.jpg',
    tag: '#hardware',
    description: {
      en: 'Implemented a 5-stage pipelined 32-bit RISC-V processor in Verilog with hazard detection, branch prediction, and synthesized on a Xilinx Artix-7 board.',
      ar: 'تصميم وتنفيذ معالج دقيق بنية RISC-V خماسي المراحل بلغة Verilog مع معالجة مخاطر البيانات والتفرع وتركيبه على لوحة Artix-7.',
    },
    createdAt: '2026-10-25T14:30:00.000Z',
  },
  {
    id: 'rtos-can-telemetry',
    title: {
      en: 'FreeRTOS CAN Bus Vehicle Telemetry',
      ar: 'نظام قياس عن بعد للمركبات عبر CAN Bus و FreeRTOS',
    },
    image: '/images/iot-monitor.jpg',
    tag: '#embedded',
    description: {
      en: 'Constructed an automotive telemetry logger using STM32 running FreeRTOS. Decodes CAN 2.0B frames and streams diagnostics to an encrypted SD card.',
      ar: 'بناء وحدة تسجيل لبيانات السيارات باستخدام معالج STM32 ونظام FreeRTOS مع فك شفرة حزم CAN 2.0B وتخزينها المشفر.',
    },
    createdAt: '2026-10-20T10:15:00.000Z',
  },
  {
    id: 'wireguard-mesh-router',
    title: {
      en: 'Zero-Trust Mesh VPN Gateway',
      ar: 'بوابة شبكة افتراضية خاصة Zero-Trust بتقنية WireGuard',
    },
    image: '/images/network-adblock.jpg',
    tag: '#networking',
    description: {
      en: 'Deployed an automated point-to-point mesh tunnel orchestrator on OpenWrt routers with kernel-level WireGuard encryption and mutual authentication.',
      ar: 'نظام توجيه شبكي مشفر بين الفروع باستخدام أنوية لينكس وتقنية WireGuard مع إدارة مركزية للهويات والشهادات.',
    },
    createdAt: '2026-10-15T08:00:00.000Z',
  },
  {
    id: 'distributed-ceph-cluster',
    title: {
      en: 'Distributed High-Availability Ceph Storage',
      ar: 'مجموعة تخزين موزعة عالية التوافر بنظام Ceph',
    },
    image: '/images/nas-storage.jpg',
    tag: '#systems',
    description: {
      en: 'Configured a 3-node fault-tolerant storage cluster with automated failover, replication policies, and Prometheus monitoring for multi-terabyte datasets.',
      ar: 'إعداد عنقود تخزين موزّع ثلاثي العقد يدعم التكرار والتعافي التلقائي عند الأعطال مع مراقبة حية للأداء والسعة.',
    },
    createdAt: '2026-10-10T12:00:00.000Z',
  },
  {
    id: 'smart-receptionist-door-lock',
    title: {
      en: 'Smart Receptionist / Door Lock',
      ar: 'قفل الباب الذكي ومسؤول الاستقبال',
    },
    image: '/images/smart-lock.jpg',
    tag: '#embedded',
    description: {
      en: 'Designed an automated access-control prototype utilizing an ESP32 microcontroller with RFID authentication and local facial verification. Handles hardware relay control for electronic strikes alongside local credential logging.',
      ar: 'نموذج أولي لنظام تحكم ذكي بالدخول باستخدام متحكم ESP32 مع مصادقة RFID والتعرف على الوجه، مع تشغيل قفل الباب الإلكتروني وسجل وصول محلي.',
    },
    createdAt: '2026-10-05T09:30:00.000Z',
  },
  {
    id: 'network-wide-ad-blocker',
    title: {
      en: 'Network-Wide Ad Blocker',
      ar: 'مانع إعلانات على مستوى الشبكة',
    },
    image: '/images/network-adblock.jpg',
    tag: '#networking',
    description: {
      en: 'Configured a low-power, DNS sinkhole appliance built on lightweight Linux to intercept tracking domains and unwanted queries network-wide. Includes custom upstream resolver routing and latency monitoring.',
      ar: 'أداة شبكية ذاتية الاستضافة على نظام لينكس تحجب الإعلانات وأجهزة التتبع على مستوى نظام أسماء النطاقات (DNS) لجميع الأجهزة المتصلة بالشبكة مع مراقبة الأداء.',
    },
    createdAt: '2026-09-28T16:20:00.000Z',
  },
  {
    id: 'home-cloud-nas-storage',
    title: {
      en: 'Home Cloud / NAS Storage',
      ar: 'سحابة منزلية ووحدة تخزين NAS',
    },
    image: '/images/nas-storage.jpg',
    tag: '#systems',
    description: {
      en: 'Architected a redundant network-attached storage node with automated snapshot backups, encrypted remote synchronization, and low-overhead local network share protocols.',
      ar: 'وحدة تخزين شبكية (NAS) ذاتية الاستضافة تدعم النسخ الاحتياطي التلقائي والمزامنة المشفرة ومشاركة الملفات السريعة عبر الشبكة المحلية.',
    },
    createdAt: '2026-09-20T11:45:00.000Z',
  },
  {
    id: 'iot-environmental-monitor',
    title: {
      en: 'IoT Environmental Monitor',
      ar: 'محطة مراقبة بيئية لإنترنت الأشياء',
    },
    image: '/images/iot-monitor.jpg',
    tag: '#iot',
    description: {
      en: 'Engineered a low-power telemetry station integrating multi-channel I2C environmental sensors with MQTT transmission. Transmits atmospheric data intervals with sub-second polling and power-save modes.',
      ar: 'نظام قياس عن بُعد منخفض الاستهلاك يدمج حساسات بيئية لقياس درجات الحرارة والرطوبة وجودة الهواء ونقل البيانات لحظياً عبر بروتوكول MQTT.',
    },
    createdAt: '2026-09-12T13:10:00.000Z',
  },
  {
    id: 'lorawan-smart-agriculture',
    title: {
      en: 'Long-Range LoRaWAN Sensor Node',
      ar: 'عقدة استشعار بعيدة المدى بتقنية LoRaWAN',
    },
    image: '/images/iot-monitor.jpg',
    tag: '#iot',
    description: {
      en: 'Built an ultra-low-power soil telemetry device operating on 868MHz frequency with deep sleep modes, running up to 3 years on a single LiFePO4 cell.',
      ar: 'جهاز قياس رطوبة التربة عبر موجات LoRaWAN باستهلاك طاقة فائق الانخفاض يعمل حتى 3 سنوات ببطارية واحدة.',
    },
    createdAt: '2026-08-30T15:00:00.000Z',
  },
  {
    id: 'optical-heart-rate-dsp',
    title: {
      en: 'DSP Photoplethysmography Analyzer',
      ar: 'محلل إشارات حيوية رقمي DSP لقياس نبضات القلب',
    },
    image: '/images/smart-lock.jpg',
    tag: '#dsp',
    description: {
      en: 'Programmed an ARM Cortex-M4 DSP pipeline implementing digital bandpass filtering and peak-detection algorithms to extract heart rate variability in real time.',
      ar: 'تطبيق خوارزميات معالجة الإشارات الرقمية وفلاتر الحزمة لفك شفرة إشارات نبضات القلب بدقة عبر معالج Cortex-M4.',
    },
    createdAt: '2026-08-15T09:00:00.000Z',
  },
  {
    id: 'packet-sniffer-dpi-engine',
    title: {
      en: 'Deep Packet Inspection Engine',
      ar: 'محرك فحص الحزم العميقة DPI للشبكات',
    },
    image: '/images/network-adblock.jpg',
    tag: '#networking',
    description: {
      en: 'Authored a multithreaded network sniffer using libpcap in C++ to classify protocols, detect anomalous TCP sessions, and export statistics to a terminal UI.',
      ar: 'تطوير أداة برمجية بلغة C++ لفحص الحزم وتحليل الجلسات المشبوهة واستخراج تقارير إحصائية للشبكة.',
    },
    createdAt: '2026-08-01T14:00:00.000Z',
  },
  {
    id: 'solar-mppt-charge-controller',
    title: {
      en: 'Digital MPPT Solar Charge Controller',
      ar: 'منظم شحن شمسي رقمي بتقنية MPPT',
    },
    image: '/images/iot-monitor.jpg',
    tag: '#hardware',
    description: {
      en: 'Engineered a synchronous buck converter with a perturb-and-observe MPPT algorithm achieving 96% energy tracking efficiency for off-grid battery systems.',
      ar: 'دائرة إلكترونية ذكية لتتبع نقطة القدرة القصوى للألواح الشمسية مع كفاءة تحويل تتجاوز 96% لشحن بطاريات الليثيوم.',
    },
    createdAt: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'baremetal-arm-microkernel',
    title: {
      en: 'Bare-Metal ARM Cortex Microkernel',
      ar: 'نواة تشغيل أولية مصغرة لمعالجات ARM Cortex',
    },
    image: '/images/nas-storage.jpg',
    tag: '#systems',
    description: {
      en: 'Developed a lightweight preemptive round-robin scheduler in C and assembly with context switching, system call interfaces, and memory protection unit support.',
      ar: 'برمجة نواة تشغيل صغيرة من الصفر تدعم الجدولة الزمنية وتبديل السياق وحماية الذاكرة عبر MPU.',
    },
    createdAt: '2026-07-05T08:30:00.000Z',
  },
  {
    id: 'sub-ghz-rf-transceiver',
    title: {
      en: 'Sub-GHz Secure RF Mesh Protocol',
      ar: 'بروتوكول شبكي لاسلكي مشفر للترددات تحت 1 جيجاهرتز',
    },
    image: '/images/smart-lock.jpg',
    tag: '#embedded',
    description: {
      en: 'Custom TDMA frequency-hopping protocol implemented on CC1101 transceivers with AES-128 payload encryption and adaptive retransmission.',
      ar: 'بروتوكول اتصال لاسلكي آمن بنظام القفز الترددي وتشفير AES-128 لربط أجهزة التحكم الميدانية المقاومة للتشويش.',
    },
    createdAt: '2026-06-18T16:00:00.000Z',
  },
];

const STORAGE_KEY = 'ce_portfolio_projects_v1';
const EVENT_NAME = 'ce_portfolio_projects_updated';

export function getStoredProjects(): StoredProject[] {
  if (typeof window === 'undefined') {
    return INITIAL_PROJECTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_PROJECTS;
  } catch (err) {
    console.error('Error loading projects from storage:', err);
    return INITIAL_PROJECTS;
  }
}

export function saveStoredProjects(projects: StoredProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Error saving projects to storage:', err);
  }
}

export function addStoredProject(newProject: Omit<StoredProject, 'id' | 'createdAt'>): StoredProject {
  const current = getStoredProjects();
  const created: StoredProject = {
    ...newProject,
    id: `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...current];
  saveStoredProjects(updated);
  return created;
}

export function updateStoredProject(id: string, updates: Partial<StoredProject>): StoredProject | null {
  const current = getStoredProjects();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProject: StoredProject = {
    ...current[index],
    ...updates,
    id: current[index].id, // preserve ID
  };
  current[index] = updatedProject;
  saveStoredProjects([...current]);
  return updatedProject;
}

export function deleteStoredProject(id: string): boolean {
  const current = getStoredProjects();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredProjects(filtered);
  return true;
}

export function resetStoredProjects(): void {
  saveStoredProjects(INITIAL_PROJECTS);
}

export function subscribeProjects(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => callback();
  window.addEventListener(EVENT_NAME, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(EVENT_NAME, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
