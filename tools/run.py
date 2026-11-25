import json,sys,io,base64,contextlib,traceback
import matplotlib; matplotlib.use('Agg')
items=json.load(sys.stdin); res={}; bad=0
PRE='''
import io as _io, base64 as _b64
def show(fig):
    _buf=_io.BytesIO(); fig.savefig(_buf, format="png", dpi=110, bbox_inches="tight")
    print("__IMG__"+_b64.b64encode(_buf.getvalue()).decode())
'''
for it in items:
    buf=io.StringIO(); g={}
    try:
        with contextlib.redirect_stdout(buf): exec(PRE+it['src'], g)
        if not it.get('starter'): res[it['key']]=buf.getvalue().rstrip('\n')
    except Exception as e:
        if it.get('starter'): print('starter err (ok?)',it['key'],e)
        else: bad+=1; print('FAIL',it['key']); traceback.print_exc()
    import matplotlib.pyplot as plt; plt.close('all')
phase_of={it['key']:it['phase'] for it in items}
by={}
for k,v in res.items():
    if not k.endswith(':exercise'): by.setdefault(phase_of[k],{})[k]=v
for ph,d in by.items(): json.dump(d, open(f'src/phases/outputs-{ph}.json','w'))
for k,v in res.items():
    if k.endswith(':exercise'): print(k, v.splitlines()[-1])
print('failures',bad); sys.exit(bad)
