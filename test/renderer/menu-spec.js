import * as menu from '../../src/notebook/menu';
import * as constants from '../../src/notebook/constants';

import { webFrame } from 'electron';

import { dummyStore } from '../utils';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('menu', () => {
  describe('dispatchCreateCellAfter', () => {
    it('dispatches a CREATE_CELL_AFTER action', () => {
      const store = dummyStore();
      store.dispatch = sinon.spy();

      menu.dispatchCreateCellAfter(store);

      expect(store.dispatch.firstCall).to.be.calledWith({
        type: constants.NEW_CELL_AFTER,
        cellType: 'code',
        source: '',
        id: null,
      });
    });
  });

  describe('dispatchPasteCell', () => {
    it('dispatches a PASTE_CELL action', () => {
      const store = dummyStore();
      store.dispatch = sinon.spy();

      menu.dispatchPasteCell(store);

      expect(store.dispatch.firstCall).to.be.calledWith({
        type: constants.PASTE_CELL,
      });
    });
  });

  describe('dispatchCutCell', () => {
    it('dispatches a CUT_CELL action', () => {
      const store = dummyStore();
      store.dispatch = sinon.spy();

      menu.dispatchCutCell(store);

      expect(store.dispatch.firstCall).to.be.calledWith({
        type: constants.CUT_CELL,
        id: null,
      });
    });
  });

  describe('dispatchCopyCell', () => {
    it('dispatches a COPY_CELL action', () => {
      const store = dummyStore();
      store.dispatch = sinon.spy();

      menu.dispatchCopyCell(store);

      expect(store.dispatch.firstCall).to.be.calledWith({
        type: constants.COPY_CELL,
        id: null,
      });
    });
  });

  describe('dispatchSetTheme', () => {
    it('dispatches a SET_THEME action', () => {
      const store = dummyStore();
      store.dispatch = sinon.spy();

      menu.dispatchSetTheme(store, {}, 'test_theme');

      expect(store.dispatch.firstCall).to.be.calledWith({
        type: constants.SET_THEME,
        theme: 'test_theme',
      });
    });
  });

  describe('dispatchZoomOut', () => {
    it('executes zoom out', () => {
      const setZoomLevel = sinon.spy(webFrame, 'setZoomLevel');
      menu.dispatchZoomOut();
      setZoomLevel.restore();
      expect(setZoomLevel).to.be.called;
    });
  });

  describe('dispatchZoomIn', () => {
    it('executes zoom in', () => {
      const setZoomLevel = sinon.spy(webFrame, 'setZoomLevel');
      menu.dispatchZoomIn();
      setZoomLevel.restore();
      expect(setZoomLevel).to.be.called;
    });
  });

  describe('dispatchRestartClearAll', () => {
    it('dispatches KILL_KERNEL and CLEAR_CELL_OUTPUT actions', () => {
      const store = dummyStore();
      store.dispatch = sinon.spy();

      menu.dispatchRestartClearAll(store);

      expect(store.dispatch.firstCall).to.be.calledWith({
        type: constants.KILL_KERNEL,
      });
    });
  });

  describe('dispatchRestartKernel', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchRestartKernel(store);

    expect(store.dispatch.firstCall).to.be.calledWith({
      type: constants.KILL_KERNEL,
    });
  });

  describe('dispatchInterruptKernel', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchInterruptKernel(store);

    if (process.platform !== 'win32') {
      expect(store.dispatch.firstCall).to.be.calledWith({
        type: constants.INTERRUPT_KERNEL,
      });
    }
  });

  describe('dispatchKillKernel', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchKillKernel(store);

    expect(store.dispatch.firstCall).to.be.calledWith({
      type: constants.KILL_KERNEL,
    });
  });

  describe('dispatchClearAll', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchClearAll(store);

    expect(store.dispatch.firstCall).to.be.calledWith({
      type: constants.CLEAR_CELL_OUTPUT,
      id: store.getState().document.getIn(['notebook', 'cellOrder']).first()
    });
  });

  describe('dispatchRunAll', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchRunAll(store);

    const first = store.getState().document.getIn(['notebook', 'cellOrder']).first();
    expect(store.dispatch.firstCall).to.be.calledWith({
      type: 'EXECUTE_CELL',
      id: first,
      source: store.getState().document.getIn(['notebook', 'cellMap', first, 'source']),
    });
  });

  describe('dispatchPublishGist', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchPublishGist(store);

    expect(store.dispatch.firstCall).to.be.calledWith({
      type: 'PUBLISH_GIST',
    });
  });

  describe('dispatchNewKernel', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchNewKernel(store, {}, 'python2');

    expect(store.dispatch.firstCall).to.be.calledWith({
      type: constants.LAUNCH_KERNEL,
      kernelSpecName: 'python2',
      cwd: { 'cwd': process.cwd() },
    });
  });

  describe('dispatchSave', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchSave(store);

    expect(store.dispatch.firstCall).to.be.calledWith({
      type: 'SAVE',
      filename: store.getState().metadata.get('filename'),
      notebook: store.getState().document.get('notebook'),
    });
  });

  describe('dispatchSaveAs', () => {
    const store = dummyStore();
    store.dispatch = sinon.spy();

    menu.dispatchSaveAs(store, {}, 'test-ipynb.ipynb');
    expect(store.dispatch.firstCall).to.be.calledWith({
      type: 'SAVE_AS',
      filename: 'test-ipynb.ipynb',
      notebook: store.getState().document.get('notebook'),
    });
  });
});
