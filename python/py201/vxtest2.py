# python2 venv
# in venv create link below for wx module
# ln -sf /usr/lib/python2.7/dist-packages/wx.pth ./venv2/lib/python2.7/site-packages/wx.pth
# ln -sf /usr/lib/python2.7/dist-packages/wx-2.8-gtk2-unicode ./venv/lib/python2.7/site-packages/wx-2.8-gtk2-unicode
import wx

from functools import partial


class MainFrame(wx.Frame):
    """
    This app shows a group of buttons
    """

    def __init__(self, *args, **kwargs):
        """Constructor"""
        super(MainFrame, self).__init__(parent=None, title='Partial')
        panel = wx.Panel(self)

        sizer = wx.BoxSizer(wx.VERTICAL)
        btn_labels = ['one', 'two', 'three']
        for label in btn_labels:
            btn = wx.Button(panel, label=label)
            btn.Bind(wx.EVT_BUTTON, partial(self.onButton, label=label))
            sizer.Add(btn, 0 , wx.ALL, 5)

        panel.SetSizer(sizer)
        self.Show()

    def onButton(self, evnet, label):
        """
        Event handler called when a button is pressed
        """
        print('You pressed: ' + str(label))


if __name__ == '__main__':
    app = wx.App(False)
    frame = MainFrame()
    app.MainLoop()

