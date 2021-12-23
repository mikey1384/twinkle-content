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
export function useHomeContext() {
  return useContextSelector(HomeContext, (v) => v);
}
export function useInputContext() {
  return useContextSelector(InputContext, (v) => v);
}
export function useInteractiveContext() {
  return useContextSelector(InteractiveContext, (v) => v);
}
export function useManagementContext() {
  return useContextSelector(ManagementContext, (v) => v);
}
export function useNotiContext() {
  return useContextSelector(NotiContext, (v) => v);
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
