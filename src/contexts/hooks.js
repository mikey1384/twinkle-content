import { useContextSelector } from 'use-context-selector';
import { AppContext } from './AppContext';
import { ChatContext } from './Chat';
import { ContentContext } from './Content';
import { ExploreContext } from './Explore';
import { HomeContext } from './Home';
import { InputContext } from './Input';
import { InteractiveContext } from './Interactive';
import { ManagementContext } from './Management';
import { NotiContext } from './Notification';
import { ProfileContext } from './Profile';
import { MissionContext } from './Mission';
import { ViewContext } from './View';

export function useAppContext(fn) {
  return useContextSelector(AppContext, fn);
}
export function useChatContext() {
  return useContextSelector(ChatContext, (v) => v);
}
export function useContentContext(fn) {
  return useContextSelector(ContentContext, fn);
}
export function useExploreContext(fn) {
  return useContextSelector(ExploreContext, fn);
}
export function useHomeContext(fn) {
  return useContextSelector(HomeContext, fn);
}
export function useInputContext(fn) {
  return useContextSelector(InputContext, fn);
}
export function useInteractiveContext(fn) {
  return useContextSelector(InteractiveContext, fn);
}
export function useManagementContext(fn) {
  return useContextSelector(ManagementContext, fn);
}
export function useNotiContext(fn) {
  return useContextSelector(NotiContext, fn);
}
export function useProfileContext() {
  return useContextSelector(ProfileContext, (v) => v);
}
export function useMissionContext() {
  return useContextSelector(MissionContext, (v) => v);
}
export function useViewContext(fn) {
  return useContextSelector(ViewContext, fn);
}
