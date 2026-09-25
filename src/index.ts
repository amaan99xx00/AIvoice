import { VoiceWidget } from './ui/VoiceWidget';
import './styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  const widget = new VoiceWidget();
  widget.initUI();
});
