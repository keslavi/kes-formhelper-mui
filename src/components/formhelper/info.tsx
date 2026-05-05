import { useState, isValidElement, ReactNode } from 'react';
import {
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import IconHelpRounded from '@mui/icons-material/HelpRounded';
import IconClear from '@mui/icons-material/Clear';
import IconHelp from '@mui/icons-material/Help';
import { color } from '../../theme-material';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InfoObject {
  label?: string;
  message?: string;
  content?: ReactNode;
  messageList?: string[];
}

export type InfoValue = string | InfoObject | ReactNode;

export interface InfoProps {
  id?: string;
  info: InfoValue;
}

// ---------------------------------------------------------------------------
// Info — absolute-positioned help icon + popover
// ---------------------------------------------------------------------------

export const Info = ({ id, info }: InfoProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  let infoHeader: ReactNode = null;
  let infoSubject: ReactNode = info as ReactNode;

  if (info && typeof info === 'object' && !isValidElement(info)) {
    const obj = info as InfoObject;
    infoHeader = obj.label ?? null;
    infoSubject = (
      <>
        {obj.message && <Typography variant="caption">{obj.message}</Typography>}
        {obj.content && isValidElement(obj.content) && obj.content}
        {obj.messageList && (
          <div>
            <ul>
              {obj.messageList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  } else if (typeof info === 'string' && info.indexOf('|') > 0) {
    const [h, s] = info.split('|');
    infoHeader = h;
    infoSubject = s;
  }

  return (
    <div style={{ position: 'absolute', right: 10, top: 5, zIndex: 1 }}>
      <IconHelpRounded
        data-testid="IconHelpRounded"
        sx={{ color: color.primary.blue, cursor: 'pointer', fontSize: '1.2rem' }}
        onClick={e => setAnchor(e.currentTarget as unknown as HTMLElement)}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { style: { width: 400 } } }}
      >
        {infoHeader && <div><b>{infoHeader}</b></div>}
        {infoSubject && (isValidElement(infoSubject)
          ? infoSubject
          : String(infoSubject)
        )}
      </Popover>
    </div>
  );
};

Info.displayName = 'Info';

// ---------------------------------------------------------------------------
// InfoIcon — inline variant with toggle
// ---------------------------------------------------------------------------

export interface InfoIconProps {
  id?: string;
  info: string | ReactNode;
  label?: ReactNode;
}

export const InfoIcon = ({ id, info, label }: InfoIconProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  let infoHeader: ReactNode = null;
  let infoSubject: ReactNode = info as ReactNode;

  if (typeof info === 'string' && info.indexOf('|') > 0) {
    const [h, s] = info.split('|');
    infoHeader = h;
    infoSubject = s;
  }

  return (
    <>
      <IconHelp
        color="primary"
        fontSize="small"
        onClick={e => setAnchor(open ? null : e.currentTarget as unknown as HTMLElement)}
        sx={{
          color: color.cobe1?.blue ?? color.primary.blue,
          position: 'absolute',
          top: '-3px',
          right: 0,
          transform: 'translate(-10%,50%)',
          cursor: 'pointer',
        }}
      />
      {label}
      <Popover
        id={id}
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { style: { width: 400 } } }}
      >
        <IconButton
          edge="start"
          aria-label="close"
          onClick={() => setAnchor(null)}
          style={{ position: 'absolute', top: 5, right: 5 }}
        >
          <IconClear fontSize="small" />
        </IconButton>
        {infoHeader && (
          <Typography variant="h5" gutterBottom>
            {infoHeader}
          </Typography>
        )}
        {infoSubject}
      </Popover>
    </>
  );
};

InfoIcon.displayName = 'InfoIcon';

export default Info;
